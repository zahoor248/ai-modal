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

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.YOUTUBE_CLIENT_ID!,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/social/youtube/callback`,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokens);
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', req.url));
    }

    // Get user info from YouTube API
    const userInfoResponse = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const userInfo = await userInfoResponse.json();
    const channel = userInfo.items?.[0];

    if (!channel) {
      return NextResponse.redirect(new URL('/dashboard?error=youtube_channel_not_found', req.url));
    }

    // Store or update social account
    const { error } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: userId,
        platform: 'youtube',
        platform_user_id: channel.id,
        platform_username: channel.snippet.title,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: tokens.expires_in ? 
          new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null,
        scopes: ['https://www.googleapis.com/auth/youtube.upload'],
        status: 'active',
        metadata: {
          channel_id: channel.id,
          channel_title: channel.snippet.title,
          thumbnail: channel.snippet.thumbnails?.default?.url,
        },
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to save social account:', error);
      return NextResponse.redirect(new URL('/dashboard?error=save_failed', req.url));
    }

    return NextResponse.redirect(new URL('/dashboard?success=youtube_connected', req.url));
  } catch (err: any) {
    console.error('YouTube callback error:', err);
    return NextResponse.redirect(new URL('/dashboard?error=connection_failed', req.url));
  }
}