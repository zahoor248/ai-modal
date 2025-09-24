import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform, redirectUrl } = await request.json();
    
    // This would integrate with OAuth providers for each platform
    // For now, we'll simulate the OAuth initiation
    const authUrls = {
      tiktok: `https://www.tiktok.com/auth/authorize/?client_key=${process.env.TIKTOK_CLIENT_KEY}&response_type=code&scope=user.info.basic,video.list&redirect_uri=${encodeURIComponent(redirectUrl)}`,
      youtube: `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload`,
      instagram: `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=user_profile,user_media&response_type=code`,
      facebook: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=pages_manage_posts,pages_read_engagement&response_type=code`
    };

    const authUrl = authUrls[platform as keyof typeof authUrls];
    
    if (!authUrl) {
      return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    // Store the connection attempt
    const { error } = await supabase
      .from('social_accounts')
      .insert({
        user_id: user.id,
        platform,
        status: 'connecting',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing connection attempt:', error);
    }

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error in social connect:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}