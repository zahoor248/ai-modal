import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // YouTube OAuth configuration
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json({ error: "YouTube integration not configured" }, { status: 500 });
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/social/youtube/callback`;
    const scope = "https://www.googleapis.com/auth/youtube.upload";
    const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`;

    return NextResponse.json({ authUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}