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

    // Instagram OAuth configuration (using Facebook Graph API)
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json({ error: "Instagram integration not configured" }, { status: 500 });
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/social/instagram/callback`;
    const scope = "instagram_basic,instagram_content_publish";
    const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');

    const authUrl = `https://api.instagram.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${scope}&` +
      `response_type=code&` +
      `state=${state}`;

    return NextResponse.json({ authUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}