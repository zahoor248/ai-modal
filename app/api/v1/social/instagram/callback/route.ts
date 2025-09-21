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

    // Exchange code for short-lived token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID!,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/social/instagram/callback`,
        code,
      }),
    });

    const shortLivedToken = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', shortLivedToken);
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', req.url));
    }

    // Exchange short-lived token for long-lived token
    const longLivedResponse = await fetch(
      `https://graph.instagram.com/access_token?` +
      `grant_type=ig_exchange_token&` +
      `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
      `access_token=${shortLivedToken.access_token}`, 
      { method: 'GET' }
    );

    const longLivedToken = await longLivedResponse.json();

    // Get user info
    const userInfoResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${longLivedToken.access_token}`
    );

    const userInfo = await userInfoResponse.json();

    if (!userInfo.id) {
      return NextResponse.redirect(new URL('/dashboard?error=instagram_user_not_found', req.url));
    }

    // Store social account
    const { error } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: userId,
        platform: 'instagram',
        platform_user_id: userInfo.id,
        platform_username: userInfo.username,
        access_token: longLivedToken.access_token,
        token_expires_at: longLivedToken.expires_in ? 
          new Date(Date.now() + longLivedToken.expires_in * 1000).toISOString() : null,
        scopes: ['instagram_basic', 'instagram_content_publish'],
        status: 'active',
        metadata: {
          username: userInfo.username,
          token_type: longLivedToken.token_type,
        },
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to save social account:', error);
      return NextResponse.redirect(new URL('/dashboard?error=save_failed', req.url));
    }

    return NextResponse.redirect(new URL('/dashboard?success=instagram_connected', req.url));
  } catch (err: any) {
    console.error('Instagram callback error:', err);
    return NextResponse.redirect(new URL('/dashboard?error=connection_failed', req.url));
  }
}