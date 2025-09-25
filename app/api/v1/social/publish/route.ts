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
          case 'twitter':
            publishResult = await publishToTwitter(socialAccount, socialPost, story);
            break;
          case 'facebook':
            publishResult = await publishToFacebook(socialAccount, socialPost, story);
            break;
          case 'linkedin':
            publishResult = await publishToLinkedIn(socialAccount, socialPost, story);
            break;
          case 'pinterest':
            publishResult = await publishToPinterest(socialAccount, socialPost, story);
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

async function publishToInstagram(socialAccount: any, socialPost: any, story: any) {
  try {
    const content = `${socialPost.title}\n\n${socialPost.description}\n\n${socialPost.hashtags.join(' ')}`;
    
    // Check if there are media URLs
    if (socialPost.media_urls && socialPost.media_urls.length > 0) {
      // Create media container
      const mediaResponse = await fetch(
        `https://graph.instagram.com/v18.0/${socialAccount.platform_user_id}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: socialPost.media_urls[0],
            caption: content,
            access_token: socialAccount.access_token
          })
        }
      );

      const mediaData = await mediaResponse.json();
      
      if (!mediaResponse.ok) {
        throw new Error(mediaData.error?.message || 'Failed to create Instagram media');
      }

      // Publish the media
      const publishResponse = await fetch(
        `https://graph.instagram.com/v18.0/${socialAccount.platform_user_id}/media_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: mediaData.id,
            access_token: socialAccount.access_token
          })
        }
      );

      const publishData = await publishResponse.json();
      
      if (!publishResponse.ok) {
        throw new Error(publishData.error?.message || 'Failed to publish to Instagram');
      }

      return {
        success: true,
        postId: publishData.id,
        message: 'Published to Instagram successfully'
      };
    } else {
      // Text-only post (Note: Instagram requires media, so this might fail)
      throw new Error('Instagram requires media (image or video) for posts');
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function publishToYouTube(socialAccount: any, socialPost: any, story: any) {
  try {
    // Note: YouTube requires video upload, which is more complex
    // This implementation assumes we're creating a community post or short
    const content = `${socialPost.title}\n\n${socialPost.description}\n\n${socialPost.hashtags.join(' ')}`;
    
    // For YouTube, we'll use the Community tab posting (if available)
    // This requires YouTube Partner Program eligibility
    const response = await fetch(
      'https://youtube.googleapis.com/youtube/v3/activities?part=snippet',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${socialAccount.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          snippet: {
            description: content,
            type: 'upload'
          }
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to post to YouTube');
    }

    return {
      success: true,
      postId: data.id,
      message: 'Posted to YouTube successfully'
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
    // TikTok requires video upload - text-only posts aren't supported
    // This is a placeholder for video upload logic
    if (!socialPost.media_urls || socialPost.media_urls.length === 0) {
      throw new Error('TikTok requires video content for posts');
    }

    // Upload video to TikTok
    const uploadResponse = await fetch('https://open-api.tiktok.com/share/video/upload/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${socialAccount.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        video: {
          video_url: socialPost.media_urls[0],
          caption: `${socialPost.title} ${socialPost.description} ${socialPost.hashtags.join(' ')}`,
          privacy_level: 'MUTUAL_FOLLOW_FRIEND',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          brand_content_toggle: false
        }
      })
    });

    const uploadData = await uploadResponse.json();
    
    if (!uploadResponse.ok || uploadData.error) {
      throw new Error(uploadData.error?.message || 'Failed to upload to TikTok');
    }

    return {
      success: true,
      postId: uploadData.data?.publish_id,
      message: 'Published to TikTok successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function publishToTwitter(socialAccount: any, socialPost: any, story: any) {
  try {
    const content = `${socialPost.title}\n\n${socialPost.description}\n\n${socialPost.hashtags.join(' ')}`;
    
    // Ensure content fits Twitter's character limit (280 characters)
    const truncatedContent = content.length > 280 ? content.substring(0, 277) + '...' : content;
    
    let tweetData: any = {
      text: truncatedContent
    };

    // Add media if available
    if (socialPost.media_urls && socialPost.media_urls.length > 0) {
      // First upload media
      const mediaIds = [];
      for (const mediaUrl of socialPost.media_urls.slice(0, 4)) { // Twitter allows max 4 images
        const mediaUploadResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${socialAccount.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            media_url: mediaUrl
          })
        });

        const mediaData = await mediaUploadResponse.json();
        if (mediaUploadResponse.ok && mediaData.media_id_string) {
          mediaIds.push(mediaData.media_id_string);
        }
      }

      if (mediaIds.length > 0) {
        tweetData.media = { media_ids: mediaIds };
      }
    }

    // Create tweet using Twitter API v2
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${socialAccount.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tweetData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || 'Failed to post to Twitter');
    }

    return {
      success: true,
      postId: data.data.id,
      message: 'Published to Twitter successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function publishToFacebook(socialAccount: any, socialPost: any, story: any) {
  try {
    const content = `${socialPost.title}\n\n${socialPost.description}\n\n${socialPost.hashtags.join(' ')}`;
    
    let postData: any = {
      message: content,
      access_token: socialAccount.access_token
    };

    // Add media if available
    if (socialPost.media_urls && socialPost.media_urls.length > 0) {
      postData.link = socialPost.media_urls[0];
    }

    // Determine where to post (user feed vs pages)
    let postUrl = `https://graph.facebook.com/v18.0/${socialAccount.platform_user_id}/feed`;
    
    // If user has pages, post to the first page instead
    if (socialAccount.metadata?.pages && socialAccount.metadata.pages.length > 0) {
      const page = socialAccount.metadata.pages[0];
      postUrl = `https://graph.facebook.com/v18.0/${page.id}/feed`;
      postData.access_token = page.access_token; // Use page access token
    }

    const response = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to post to Facebook');
    }

    return {
      success: true,
      postId: data.id,
      message: 'Published to Facebook successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function publishToLinkedIn(socialAccount: any, socialPost: any, story: any) {
  try {
    const content = `${socialPost.title}\n\n${socialPost.description}\n\n${socialPost.hashtags.join(' ')}`;
    
    let postData: any = {
      author: `urn:li:person:${socialAccount.platform_user_id}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    // Add media if available
    if (socialPost.media_urls && socialPost.media_urls.length > 0) {
      postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
      postData.specificContent['com.linkedin.ugc.ShareContent'].media = [{
        status: 'READY',
        description: {
          text: socialPost.description
        },
        media: socialPost.media_urls[0],
        title: {
          text: socialPost.title
        }
      }];
    }

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${socialAccount.access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to post to LinkedIn');
    }

    return {
      success: true,
      postId: data.id,
      message: 'Published to LinkedIn successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function publishToPinterest(socialAccount: any, socialPost: any, story: any) {
  try {
    if (!socialPost.media_urls || socialPost.media_urls.length === 0) {
      throw new Error('Pinterest requires an image for posts');
    }

    // Get user's boards
    const boards = socialAccount.metadata?.boards || [];
    if (boards.length === 0) {
      throw new Error('No Pinterest boards found');
    }

    // Use the first board or a default board
    const boardId = boards[0].id;
    
    const pinData = {
      link: socialPost.media_urls[0],
      title: socialPost.title,
      description: `${socialPost.description}\n\n${socialPost.hashtags.join(' ')}`,
      board_id: boardId,
      media_source: {
        source_type: 'image_url',
        url: socialPost.media_urls[0]
      }
    };

    const response = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${socialAccount.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pinData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create pin on Pinterest');
    }

    return {
      success: true,
      postId: data.id,
      message: 'Published to Pinterest successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}