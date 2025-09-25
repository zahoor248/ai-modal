import { NextRequest, NextResponse } from 'next/server';

interface ScheduleRequest {
  platform: string[];
  content: {
    text?: string;
    media?: string[];
    hashtags?: string[];
    type: 'post' | 'story' | 'video' | 'thread' | 'article';
  };
  scheduleTime: string; // ISO string
  timezone: string;
  recurring?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    days?: string[]; // for weekly: ['monday', 'wednesday']
    endDate?: string;
  };
}

interface ScheduledPost {
  id: string;
  platforms: string[];
  content: any;
  scheduledFor: Date;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  timezone: string;
  recurring?: any;
  createdAt: Date;
  publishedAt?: Date;
  error?: string;
}

// In production, this would connect to a database
let scheduledPosts: ScheduledPost[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: ScheduleRequest = await request.json();
    const { platform, content, scheduleTime, timezone, recurring } = body;

    // Validate request
    if (!platform || !platform.length) {
      return NextResponse.json(
        { error: 'At least one platform is required' },
        { status: 400 }
      );
    }

    if (!content || !content.type) {
      return NextResponse.json(
        { error: 'Content and content type are required' },
        { status: 400 }
      );
    }

    if (!scheduleTime) {
      return NextResponse.json(
        { error: 'Schedule time is required' },
        { status: 400 }
      );
    }

    // Create scheduled post
    const scheduledPost: ScheduledPost = {
      id: generateId(),
      platforms: platform,
      content,
      scheduledFor: new Date(scheduleTime),
      status: 'scheduled',
      timezone,
      recurring,
      createdAt: new Date(),
    };

    // Validate schedule time is in the future
    if (scheduledPost.scheduledFor <= new Date()) {
      return NextResponse.json(
        { error: 'Schedule time must be in the future' },
        { status: 400 }
      );
    }

    // Add to schedule
    scheduledPosts.push(scheduledPost);

    // In production, would schedule background job for publishing
    console.log(`Scheduled post ${scheduledPost.id} for ${scheduledPost.scheduledFor}`);

    return NextResponse.json({
      success: true,
      scheduledPost: {
        id: scheduledPost.id,
        platforms: scheduledPost.platforms,
        scheduledFor: scheduledPost.scheduledFor,
        status: scheduledPost.status,
        timezone: scheduledPost.timezone
      }
    });

  } catch (error: any) {
    console.error('Error scheduling post:', error);
    return NextResponse.json(
      { error: 'Failed to schedule post: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredPosts = [...scheduledPosts];

    // Filter by status
    if (status) {
      filteredPosts = filteredPosts.filter(post => post.status === status);
    }

    // Filter by platform
    if (platform) {
      filteredPosts = filteredPosts.filter(post => 
        post.platforms.includes(platform)
      );
    }

    // Sort by scheduled time
    filteredPosts.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());

    // Limit results
    filteredPosts = filteredPosts.slice(0, limit);

    return NextResponse.json({
      success: true,
      posts: filteredPosts.map(post => ({
        id: post.id,
        platforms: post.platforms,
        content: {
          type: post.content.type,
          preview: truncateText(post.content.text || '', 100),
          hasMedia: post.content.media && post.content.media.length > 0
        },
        scheduledFor: post.scheduledFor,
        status: post.status,
        timezone: post.timezone,
        recurring: post.recurring,
        createdAt: post.createdAt,
        publishedAt: post.publishedAt,
        error: post.error
      })),
      total: scheduledPosts.length
    });

  } catch (error: any) {
    console.error('Error fetching scheduled posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled posts: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');
    const action = searchParams.get('action'); // 'cancel', 'reschedule', 'publish'

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const postIndex = scheduledPosts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Scheduled post not found' },
        { status: 404 }
      );
    }

    const post = scheduledPosts[postIndex];

    switch (action) {
      case 'cancel':
        post.status = 'cancelled';
        break;

      case 'publish':
        // Immediately publish the post
        const publishResult = await publishToSocialMedia(post);
        if (publishResult.success) {
          post.status = 'published';
          post.publishedAt = new Date();
        } else {
          post.status = 'failed';
          post.error = publishResult.error;
        }
        break;

      case 'reschedule':
        const body = await request.json();
        if (body.scheduleTime) {
          post.scheduledFor = new Date(body.scheduleTime);
          post.status = 'scheduled';
          post.error = undefined;
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: cancel, reschedule, or publish' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        platforms: post.platforms,
        scheduledFor: post.scheduledFor,
        status: post.status,
        publishedAt: post.publishedAt,
        error: post.error
      }
    });

  } catch (error: any) {
    console.error('Error updating scheduled post:', error);
    return NextResponse.json(
      { error: 'Failed to update scheduled post: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const postIndex = scheduledPosts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Scheduled post not found' },
        { status: 404 }
      );
    }

    scheduledPosts.splice(postIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Scheduled post deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting scheduled post:', error);
    return NextResponse.json(
      { error: 'Failed to delete scheduled post: ' + error.message },
      { status: 500 }
    );
  }
}

// Helper functions
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

async function publishToSocialMedia(post: ScheduledPost): Promise<{success: boolean, error?: string}> {
  try {
    // In production, this would integrate with actual social media APIs
    console.log(`Publishing post ${post.id} to platforms:`, post.platforms);
    
    const results = await Promise.all(
      post.platforms.map(platform => publishToPlatform(platform, post.content))
    );

    const failures = results.filter(result => !result.success);
    
    if (failures.length > 0) {
      return {
        success: false,
        error: `Failed to publish to: ${failures.map(f => f.platform).join(', ')}`
      };
    }

    return { success: true };

  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function publishToPlatform(platform: string, content: any): Promise<{success: boolean, platform: string, error?: string}> {
  // Mock implementation - in production, integrate with actual APIs
  console.log(`Publishing to ${platform}:`, content);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate 95% success rate
  const success = Math.random() > 0.05;
  
  return {
    success,
    platform,
    error: success ? undefined : `API error for ${platform}`
  };
}

// Background job simulator (in production, use a proper job queue)
setInterval(async () => {
  const now = new Date();
  const postsToPublish = scheduledPosts.filter(
    post => post.status === 'scheduled' && post.scheduledFor <= now
  );

  for (const post of postsToPublish) {
    console.log(`Auto-publishing scheduled post ${post.id}`);
    const result = await publishToSocialMedia(post);
    
    if (result.success) {
      post.status = 'published';
      post.publishedAt = new Date();
    } else {
      post.status = 'failed';
      post.error = result.error;
    }
  }
}, 60000); // Check every minute