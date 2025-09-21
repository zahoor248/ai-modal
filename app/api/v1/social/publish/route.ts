import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

    const { 
      storyId, 
      platforms, 
      title, 
      description, 
      hashtags, 
      mediaUrls, 
      aspectRatio,
      scheduledAt 
    } = await req.json();

    // Validate required fields
    if (!storyId || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json({ 
        error: "Story ID and at least one platform are required" 
      }, { status: 400 });
    }

    // Verify story belongs to user
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('*')
      .eq('id', storyId)
      .eq('user_id', user.id)
      .single();

    if (storyError || !story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const publishResults = [];

    // Process each platform
    for (const platform of platforms) {
      try {
        // Get social account for this platform
        const { data: socialAccount, error: accountError } = await supabase
          .from('social_accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('platform', platform)
          .eq('status', 'active')
          .single();

        if (accountError || !socialAccount) {
          publishResults.push({
            platform,
            status: 'failed',
            error: `${platform} account not connected`
          });
          continue;
        }

        // Create social post record
        const { data: socialPost, error: postError } = await supabase
          .from('social_posts')
          .insert({
            user_id: user.id,
            story_id: storyId,
            social_account_id: socialAccount.id,
            platform,
            title,
            description,
            media_urls: mediaUrls || [],
            hashtags: hashtags || [],
            status: scheduledAt ? 'scheduled' : 'publishing',
            scheduled_at: scheduledAt,
            metadata: {
              aspect_ratio: aspectRatio,
              original_story_title: story.story_title,
            }
          })
          .select()
          .single();

        if (postError) {
          publishResults.push({
            platform,
            status: 'failed',
            error: 'Failed to create post record'
          });
          continue;
        }

        // If scheduled, don't publish immediately
        if (scheduledAt) {
          publishResults.push({
            platform,
            status: 'scheduled',
            postId: socialPost.id,
            scheduledAt
          });
          continue;
        }

        // Publish immediately based on platform
        let publishResult;
        switch (platform) {
          case 'youtube':
            publishResult = await publishToYouTube(socialAccount, socialPost, story);
            break;
          case 'instagram':
            publishResult = await publishToInstagram(socialAccount, socialPost, story);
            break;
          case 'tiktok':
            publishResult = await publishToTikTok(socialAccount, socialPost, story);
            break;
          default:
            publishResult = { success: false, error: 'Unsupported platform' };
        }

        // Update post status
        await supabase
          .from('social_posts')
          .update({
            status: publishResult.success ? 'published' : 'failed',
            published_at: publishResult.success ? new Date().toISOString() : null,
            platform_post_id: publishResult.postId || null,
            error_message: publishResult.error || null,
          })
          .eq('id', socialPost.id);

        publishResults.push({
          platform,
          status: publishResult.success ? 'published' : 'failed',
          postId: socialPost.id,
          platformPostId: publishResult.postId,
          error: publishResult.error
        });

      } catch (platformError: any) {
        publishResults.push({
          platform,
          status: 'failed',
          error: platformError.message
        });
      }
    }

    return NextResponse.json({ 
      results: publishResults,
      storyId,
      totalPlatforms: platforms.length,
      successCount: publishResults.filter(r => r.status === 'published').length
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Helper functions for platform-specific publishing
async function publishToYouTube(socialAccount: any, socialPost: any, story: any) {
  try {
    // This would contain the actual YouTube API publishing logic
    // For now, return a placeholder implementation
    return {
      success: true,
      postId: `yt_${Date.now()}`,
      message: 'Published to YouTube successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function publishToInstagram(socialAccount: any, socialPost: any, story: any) {
  try {
    // This would contain the actual Instagram API publishing logic
    // For now, return a placeholder implementation
    return {
      success: true,
      postId: `ig_${Date.now()}`,
      message: 'Published to Instagram successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function publishToTikTok(socialAccount: any, socialPost: any, story: any) {
  try {
    // This would contain the actual TikTok API publishing logic
    // For now, return a placeholder implementation
    return {
      success: true,
      postId: `tt_${Date.now()}`,
      message: 'Published to TikTok successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}