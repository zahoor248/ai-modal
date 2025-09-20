import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { story, prompt, storyLength, selectedTemplate } = await req.json();

    // ✅ Ensure user is logged in
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Insert into stories table
    const { data, error } = await supabase
      .from("stories")
      .insert([
        {
          story_title: prompt || "Untitled Story",
          content: story,
          type: selectedTemplate?.type || "custom",
          prompt,
          length: storyLength,
          cover_image: null, // placeholder for now
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ story: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
