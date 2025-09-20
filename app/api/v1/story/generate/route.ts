// /api/generate/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { fullPrompt, mode = "full" } = await req.json();

  const resp = await fetch("https://mlvoca.com/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "deepseek-r1:1.5b",
      prompt: fullPrompt,
    }),
  });

  if (!resp.ok || !resp.body) {
    return NextResponse.json(
      { error: "Failed to reach LLM API" },
      { status: 502 }
    );
  }

  const decoder = new TextDecoder();
  let fullStory = "";

  if (mode === "stream") {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = resp.body!.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullStory += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Wait until LLM fully finishes
  const reader = resp.body!.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    fullStory += decoder.decode(value, { stream: true });
  }

  if (!fullStory.trim()) {
    return NextResponse.json(
      { error: "LLM returned empty story" },
      { status: 500 }
    );
  }

  return NextResponse.json({ story: fullStory });
}
