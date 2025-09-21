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
    const tokenResponse = await fetch('https://open-api.tiktok.com/oauth/access_token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_ID!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/social/tiktok/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', req.url));
    }

    const accessToken = tokenData.data.access_token;
    const refreshToken = tokenData.data.refresh_token;
    const expiresIn = tokenData.data.expires_in;

    // Get user info
    const userInfoResponse = await fetch('https://open-api.tiktok.com/user/info/', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        fields: ['open_id', 'union_id', 'avatar_url', 'display_name']
      }),
    });

    const userInfoData = await userInfoResponse.json();

    if (!userInfoData.data) {
      return NextResponse.redirect(new URL('/dashboard?error=tiktok_user_not_found', req.url));
    }

    const userInfo = userInfoData.data.user;

    // Store social account
    const { error } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: userId,
        platform: 'tiktok',
        platform_user_id: userInfo.open_id,
        platform_username: userInfo.display_name,
        access_token: accessToken,
        refresh_token: refreshToken,
        token_expires_at: expiresIn ? 
          new Date(Date.now() + expiresIn * 1000).toISOString() : null,
        scopes: ['video.upload'],
        status: 'active',
        metadata: {
          open_id: userInfo.open_id,
          union_id: userInfo.union_id,
          display_name: userInfo.display_name,
          avatar_url: userInfo.avatar_url,
        },
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to save social account:', error);
      return NextResponse.redirect(new URL('/dashboard?error=save_failed', req.url));
    }

    return NextResponse.redirect(new URL('/dashboard?success=tiktok_connected', req.url));
  } catch (err: any) {
    console.error('TikTok callback error:', err);
    return NextResponse.redirect(new URL('/dashboard?error=connection_failed', req.url));
  }
}