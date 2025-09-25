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
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${process.env.FACEBOOK_CLIENT_ID}&` +
      `client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&` +
      `redirect_uri=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/social/facebook/callback`)}&` +
      `code=${code}`;
    
    const tokenResponse = await fetch(tokenUrl);

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok || tokens.error) {
      console.error('Facebook token exchange failed:', tokens);
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', req.url));
    }

    // Exchange short-lived token for long-lived token
    const longLivedResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `grant_type=fb_exchange_token&` +
      `client_id=${process.env.FACEBOOK_CLIENT_ID}&` +
      `client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&` +
      `fb_exchange_token=${tokens.access_token}`
    );

    const longLivedToken = await longLivedResponse.json();

    // Get user info
    const userInfoResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${longLivedToken.access_token}`
    );

    const userInfo = await userInfoResponse.json();

    // Get user's pages (for posting to Facebook pages)
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token,category&access_token=${longLivedToken.access_token}`
    );

    const pagesData = await pagesResponse.json();

    if (!userInfo.id) {
      return NextResponse.redirect(new URL('/dashboard?error=facebook_user_not_found', req.url));
    }

    // Store social account
    const { error } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: userId,
        platform: 'facebook',
        platform_user_id: userInfo.id,
        platform_username: userInfo.name,
        access_token: longLivedToken.access_token,
        token_expires_at: longLivedToken.expires_in ? 
          new Date(Date.now() + longLivedToken.expires_in * 1000).toISOString() : null,
        scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list', 'publish_to_groups', 'user_posts'],
        status: 'active',
        metadata: {
          name: userInfo.name,
          email: userInfo.email,
          pages: pagesData.data || [],
        },
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing Facebook account:', error);
      return NextResponse.redirect(new URL('/dashboard?error=connection_failed', req.url));
    }

    return NextResponse.redirect(new URL('/dashboard?success=facebook_connected', req.url));
  } catch (err: any) {
    console.error('Facebook OAuth error:', err);
    return NextResponse.redirect(new URL('/dashboard?error=connection_failed', req.url));
  }
}