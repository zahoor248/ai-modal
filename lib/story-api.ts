export async function generateStory(prompt: string): Promise<string> {
  const resp = await fetch("https://mlvoca.com/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-r1:1.5b",
      prompt,
    }),
  });

  if (!resp.ok) {
    throw new Error(`API error: ${resp.status}`);
  }

  const reader = resp.body?.getReader();
  let fullText = "";

  if (!reader) return fullText;

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const parts = chunk
      .split("\n")
      .filter((line) => line.trim().length > 0);

    for (const part of parts) {
      try {
        const json = JSON.parse(part);
        if (json.response) fullText += json.response;
      } catch {
        // ignore malformed lines
      }
    }
  }

  return fullText.trim();
}
