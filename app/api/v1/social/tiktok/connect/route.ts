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

    // TikTok OAuth configuration
    const clientId = process.env.TIKTOK_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json({ error: "TikTok integration not configured" }, { status: 500 });
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/social/tiktok/callback`;
    const scope = "video.upload";
    const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');

    const authUrl = `https://www.tiktok.com/auth/authorize/?` +
      `client_key=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${scope}&` +
      `state=${state}`;

    return NextResponse.json({ authUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}