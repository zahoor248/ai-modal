// TikTok API Integration
// Real API implementation for TikTok posting and analytics

interface TikTokConfig {
  clientKey: string;
  clientSecret: string;
  redirectUri: string;
}

interface TikTokTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  scopes: string[];
  openId: string;
}

interface TikTokVideo {
  video_url?: string;
  video_file?: Blob;
  title: string;
  description?: string;
  privacy_level: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
  disable_duet?: boolean;
  disable_comment?: boolean;
  disable_stitch?: boolean;
  brand_content_toggle?: boolean;
  brand_organic_toggle?: boolean;
}

interface TikTokUserInfo {
  open_id: string;
  union_id: string;
  avatar_url: string;
  avatar_url_100: string;
  avatar_large_url: string;
  display_name: string;
  bio_description: string;
  profile_deep_link: string;
  is_verified: boolean;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

export class TikTokAPI {
  private config: TikTokConfig;
  private baseUrl = 'https://open.tiktokapis.com/v2';

  constructor(config: TikTokConfig) {
    this.config = config;
  }

  // Get OAuth authorization URL
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_key: this.config.clientKey,
      response_type: 'code',
      scope: [
        'user.info.basic',
        'user.info.profile',
        'user.info.stats',
        'video.list',
        'video.upload',
        'video.publish'
      ].join(','),
      redirect_uri: this.config.redirectUri,
      state: state || '',
    });

    return `https://www.tiktok.com/v2/auth/authorize/?${params}`;
  }

  // Exchange code for access token
  async exchangeCodeForToken(code: string): Promise<TikTokTokens> {
    try {
      const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
        },
        body: new URLSearchParams({
          client_key: this.config.clientKey,
          client_secret: this.config.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.config.redirectUri,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`TikTok OAuth error: ${error.error_description || error.message}`);
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
        scopes: data.scope?.split(',') || [],
        openId: data.open_id
      };
    } catch (error) {
      console.error('Error exchanging TikTok code:', error);
      throw error;
    }
  }

  // Get user information
  async getUserInfo(accessToken: string): Promise<TikTokUserInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/user/info/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: [
            'open_id',
            'union_id',
            'avatar_url',
            'avatar_url_100',
            'avatar_large_url',
            'display_name',
            'bio_description',
            'profile_deep_link',
            'is_verified',
            'follower_count',
            'following_count',
            'likes_count',
            'video_count'
          ]
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch TikTok user info: ${error.error.message}`);
      }

      const data = await response.json();
      return data.data.user;
    } catch (error) {
      console.error('Error fetching TikTok user info:', error);
      throw error;
    }
  }

  // Upload video to TikTok
  async uploadVideo(accessToken: string, video: TikTokVideo): Promise<{ publish_id: string }> {
    try {
      // Step 1: Initialize video upload
      const initResponse = await fetch(`${this.baseUrl}/post/publish/video/init/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_info: {
            title: video.title,
            description: video.description || '',
            privacy_level: video.privacy_level,
            disable_duet: video.disable_duet || false,
            disable_comment: video.disable_comment || false,
            disable_stitch: video.disable_stitch || false,
            brand_content_toggle: video.brand_content_toggle || false,
            brand_organic_toggle: video.brand_organic_toggle || false,
          },
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: video.video_file?.size || 0,
            chunk_size: 10000000, // 10MB chunks
            total_chunk_count: 1,
          }
        }),
      });

      if (!initResponse.ok) {
        const error = await initResponse.json();
        throw new Error(`TikTok upload init failed: ${error.error.message}`);
      }

      const initData = await initResponse.json();
      const publishId = initData.data.publish_id;
      const uploadUrl = initData.data.upload_url;

      // Step 2: Upload video file
      if (video.video_file) {
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Range': `bytes 0-${video.video_file.size - 1}/${video.video_file.size}`,
            'Content-Length': video.video_file.size.toString(),
          },
          body: video.video_file,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload video to TikTok');
        }
      } else if (video.video_url) {
        // For URL-based uploads, TikTok requires the video to be downloaded first
        const videoResponse = await fetch(video.video_url);
        if (!videoResponse.ok) {
          throw new Error('Failed to download video from URL');
        }
        
        const videoBlob = await videoResponse.blob();
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Range': `bytes 0-${videoBlob.size - 1}/${videoBlob.size}`,
            'Content-Length': videoBlob.size.toString(),
          },
          body: videoBlob,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload video to TikTok');
        }
      }

      // Step 3: Confirm upload
      const confirmResponse = await fetch(`${this.baseUrl}/post/publish/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publish_id: publishId,
        }),
      });

      if (!confirmResponse.ok) {
        const error = await confirmResponse.json();
        throw new Error(`TikTok publish confirmation failed: ${error.error.message}`);
      }

      return { publish_id: publishId };
    } catch (error) {
      console.error('Error uploading TikTok video:', error);
      throw error;
    }
  }

  // Get video publishing status
  async getPublishStatus(accessToken: string, publishId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/post/publish/status/fetch/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publish_id: publishId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch TikTok publish status');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching TikTok publish status:', error);
      throw error;
    }
  }

  // Get user's videos
  async getUserVideos(accessToken: string, cursor?: string, maxCount = 20): Promise<any> {
    try {
      const body: any = {
        max_count: maxCount,
        fields: [
          'id',
          'title',
          'video_description',
          'duration',
          'cover_image_url',
          'embed_html',
          'embed_link',
          'like_count',
          'comment_count',
          'share_count',
          'view_count'
        ]
      };

      if (cursor) {
        body.cursor = cursor;
      }

      const response = await fetch(`${this.baseUrl}/video/list/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch TikTok user videos');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching TikTok user videos:', error);
      throw error;
    }
  }

  // Get video analytics
  async getVideoAnalytics(accessToken: string, videoIds: string[]): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/research/video/query/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters: {
            video_ids: videoIds,
          },
          fields: [
            'id',
            'like_count',
            'comment_count',
            'share_count',
            'view_count',
            'profile_visits_rate'
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch TikTok video analytics');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching TikTok video analytics:', error);
      throw error;
    }
  }

  // Search for trending hashtags and sounds
  async searchHashtags(keyword: string, accessToken: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/research/hashtag/list/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters: {
            keyword: keyword,
          },
          fields: [
            'hashtag_name',
            'hashtag_id',
            'is_commerce',
            'view_count',
            'video_count'
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to search TikTok hashtags');
      }

      return response.json();
    } catch (error) {
      console.error('Error searching TikTok hashtags:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<TikTokTokens> {
    try {
      const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_key: this.config.clientKey,
          client_secret: this.config.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Token refresh failed: ${error.error_description}`);
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
        scopes: data.scope?.split(',') || [],
        openId: data.open_id
      };
    } catch (error) {
      console.error('Error refreshing TikTok token:', error);
      throw error;
    }
  }

  // Validate video content
  validateVideo(video: TikTokVideo): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!video.title || video.title.trim().length === 0) {
      errors.push('Video title is required');
    }

    if (video.title && video.title.length > 150) {
      errors.push('Video title must be 150 characters or less');
    }

    if (video.description && video.description.length > 2200) {
      errors.push('Video description must be 2200 characters or less');
    }

    if (!video.video_file && !video.video_url) {
      errors.push('Either video file or video URL must be provided');
    }

    if (!video.privacy_level) {
      errors.push('Privacy level is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check video upload requirements
  validateVideoFile(file: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const maxSize = 4 * 1024 * 1024 * 1024; // 4GB
    const allowedTypes = ['video/mp4', 'video/webm', 'video/mov'];

    if (file.size > maxSize) {
      errors.push('Video file must be smaller than 4GB');
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('Video must be MP4, WebM, or MOV format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}