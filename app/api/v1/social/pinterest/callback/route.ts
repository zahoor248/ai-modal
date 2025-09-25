import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  try {
    if (!code || !state) {
      return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', req.url));
    }

    // Decode state to get user ID
    const { userId } = JSON.parse(Buffer.from(state, 'base64').toString());

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/social/pinterest/callback`,
        client_id: process.env.PINTEREST_CLIENT_ID!,
        client_secret: process.env.PINTEREST_CLIENT_SECRET!,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok || tokens.error) {
      console.error('Pinterest token exchange failed:', tokens);
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', req.url));
    }

    // Get user info
    const userInfoResponse = await fetch('https://api.pinterest.com/v5/user_account', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const userInfo = await userInfoResponse.json();

    // Get user's boards
    const boardsResponse = await fetch('https://api.pinterest.com/v5/boards', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const boardsData = await boardsResponse.json();

    if (!userInfo.username) {
      return NextResponse.redirect(new URL('/dashboard?error=pinterest_user_not_found', req.url));
    }

    // Store social account
    const { error } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: userId,
        platform: 'pinterest',
        platform_user_id: userInfo.username,
        platform_username: userInfo.username,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: tokens.expires_in ? 
          new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null,
        scopes: ['boards:read', 'boards:write', 'pins:read', 'pins:write'],
        status: 'active',
        metadata: {
          account_type: userInfo.account_type,
          profile_image: userInfo.profile_image,
          website_url: userInfo.website_url,
          boards: boardsData.items || [],
        },
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing Pinterest account:', error);
      return NextResponse.redirect(new URL('/dashboard?error=connection_failed', req.url));
    }

    return NextResponse.redirect(new URL('/dashboard?success=pinterest_connected', req.url));
  } catch (err: any) {
    console.error('Pinterest OAuth error:', err);
    return NextResponse.redirect(new URL('/dashboard?error=connection_failed', req.url));
  }
}