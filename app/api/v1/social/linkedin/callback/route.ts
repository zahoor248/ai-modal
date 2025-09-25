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
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/social/linkedin/callback`,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok || tokens.error) {
      console.error('LinkedIn token exchange failed:', tokens);
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', req.url));
    }

    // Get user info
    const userInfoResponse = await fetch(
      'https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    const userInfo = await userInfoResponse.json();

    // Get email address
    const emailResponse = await fetch(
      'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    const emailData = await emailResponse.json();
    const email = emailData.elements?.[0]?.['handle~']?.emailAddress;

    if (!userInfo.id) {
      return NextResponse.redirect(new URL('/dashboard?error=linkedin_user_not_found', req.url));
    }

    // Store social account
    const { error } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: userId,
        platform: 'linkedin',
        platform_user_id: userInfo.id,
        platform_username: `${userInfo.firstName?.localized?.en_US} ${userInfo.lastName?.localized?.en_US}`,
        access_token: tokens.access_token,
        token_expires_at: tokens.expires_in ? 
          new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null,
        scopes: ['w_member_social', 'r_liteprofile', 'r_emailaddress'],
        status: 'active',
        metadata: {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: email,
          profilePicture: userInfo.profilePicture,
        },
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing LinkedIn account:', error);
      return NextResponse.redirect(new URL('/dashboard?error=connection_failed', req.url));
    }

    return NextResponse.redirect(new URL('/dashboard?success=linkedin_connected', req.url));
  } catch (err: any) {
    console.error('LinkedIn OAuth error:', err);
    return NextResponse.redirect(new URL('/dashboard?error=connection_failed', req.url));
  }
}