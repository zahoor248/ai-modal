import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.redirect('/login?error=unauthorized');
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect('/profile-settings?error=oauth_failed');
    }

    if (!code) {
      return NextResponse.redirect('/profile-settings?error=no_code');
    }

    // Exchange code for access token based on platform
    let tokenData;
    try {
      tokenData = await exchangeCodeForToken(params.platform, code);
    } catch (error) {
      console.error('Token exchange error:', error);
      return NextResponse.redirect('/profile-settings?error=token_exchange_failed');
    }

    // Get user info from the platform
    const platformUserInfo = await getPlatformUserInfo(params.platform, tokenData.access_token);

    // Store the connected account
    const { error: dbError } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: user.id,
        platform: params.platform,
        platform_user_id: platformUserInfo.id,
        platform_username: platformUserInfo.username,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: tokenData.expires_at,
        status: 'active',
        updated_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Error storing social account:', dbError);
      return NextResponse.redirect('/profile-settings?error=storage_failed');
    }

    return NextResponse.redirect('/profile-settings?success=connected');
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    return NextResponse.redirect('/profile-settings?error=callback_failed');
  }
}

async function exchangeCodeForToken(platform: string, code: string) {
  const tokenEndpoints = {
    tiktok: 'https://open-api.tiktok.com/oauth/access_token/',
    youtube: 'https://oauth2.googleapis.com/token',
    instagram: 'https://api.instagram.com/oauth/access_token',
    facebook: 'https://graph.facebook.com/v18.0/oauth/access_token'
  };

  const endpoint = tokenEndpoints[platform as keyof typeof tokenEndpoints];
  if (!endpoint) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  // Platform-specific token exchange logic
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: getClientId(platform),
      client_secret: getClientSecret(platform),
      redirect_uri: getRedirectUri(platform)
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  return await response.json();
}

async function getPlatformUserInfo(platform: string, accessToken: string) {
  const userInfoEndpoints = {
    tiktok: 'https://open-api.tiktok.com/user/info/',
    youtube: 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
    instagram: 'https://graph.instagram.com/me?fields=id,username',
    facebook: 'https://graph.facebook.com/me?fields=id,name'
  };

  const endpoint = userInfoEndpoints[platform as keyof typeof userInfoEndpoints];
  if (!endpoint) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Normalize user info across platforms
  switch (platform) {
    case 'tiktok':
      return { id: data.data.user.id, username: data.data.user.username };
    case 'youtube':
      return { id: data.items[0].id, username: data.items[0].snippet.title };
    case 'instagram':
      return { id: data.id, username: data.username };
    case 'facebook':
      return { id: data.id, username: data.name };
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

function getClientId(platform: string): string {
  const clientIds = {
    tiktok: process.env.TIKTOK_CLIENT_KEY!,
    youtube: process.env.GOOGLE_CLIENT_ID!,
    instagram: process.env.INSTAGRAM_CLIENT_ID!,
    facebook: process.env.FACEBOOK_APP_ID!
  };
  return clientIds[platform as keyof typeof clientIds];
}

function getClientSecret(platform: string): string {
  const clientSecrets = {
    tiktok: process.env.TIKTOK_CLIENT_SECRET!,
    youtube: process.env.GOOGLE_CLIENT_SECRET!,
    instagram: process.env.INSTAGRAM_CLIENT_SECRET!,
    facebook: process.env.FACEBOOK_APP_SECRET!
  };
  return clientSecrets[platform as keyof typeof clientSecrets];
}

function getRedirectUri(platform: string): string {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  return `${baseUrl}/api/v1/social/${platform}/callback`;
}