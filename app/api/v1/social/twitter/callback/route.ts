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

    // Get stored code verifier
    const { data: oauthState, error: stateError } = await supabase
      .from('oauth_states')
      .select('code_verifier')
      .eq('user_id', userId)
      .eq('platform', 'twitter')
      .eq('state', state)
      .single();

    if (stateError || !oauthState) {
      return NextResponse.redirect(new URL('/dashboard?error=invalid_state', req.url));
    }

    // Exchange code for tokens using PKCE
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/social/twitter/callback`,
        code_verifier: oauthState.code_verifier,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Twitter token exchange failed:', tokens);
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', req.url));
    }

    // Get user info from Twitter API v2
    const userInfoResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url,public_metrics', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const userInfo = await userInfoResponse.json();

    if (!userInfo.data) {
      return NextResponse.redirect(new URL('/dashboard?error=twitter_user_not_found', req.url));
    }

    const userData = userInfo.data;

    // Store social account
    const { error } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: userId,
        platform: 'twitter',
        platform_user_id: userData.id,
        platform_username: userData.username,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: tokens.expires_in ? 
          new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null,
        scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
        status: 'active',
        metadata: {
          name: userData.name,
          username: userData.username,
          profile_image_url: userData.profile_image_url,
          public_metrics: userData.public_metrics,
        },
        updated_at: new Date().toISOString()
      });

    // Clean up oauth state
    await supabase
      .from('oauth_states')
      .delete()
      .eq('user_id', userId)
      .eq('platform', 'twitter')
      .eq('state', state);

    if (error) {
      console.error('Error storing Twitter account:', error);
      return NextResponse.redirect(new URL('/dashboard?error=connection_failed', req.url));
    }

    return NextResponse.redirect(new URL('/dashboard?success=twitter_connected', req.url));
  } catch (err: any) {
    console.error('Twitter OAuth error:', err);
    return NextResponse.redirect(new URL('/dashboard?error=connection_failed', req.url));
  }
}