// Instagram Graph API Integration
// Real API implementation for posting to Instagram

interface InstagramConfig {
  appId: string;
  appSecret: string;
  redirectUri: string;
}

interface InstagramPost {
  image_url?: string;
  video_url?: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  children?: string[]; // For carousel posts
  is_published?: boolean;
  published_at?: string;
}

interface InstagramMedia {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  caption: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export class InstagramAPI {
  private config: InstagramConfig;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(config: InstagramConfig) {
    this.config = config;
  }

  // Get Instagram Business accounts connected to Facebook page
  async getInstagramAccounts(pageAccessToken: string, pageId: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Instagram accounts');
      }

      const data = await response.json();
      return data.instagram_business_account ? [data.instagram_business_account] : [];
    } catch (error) {
      console.error('Error fetching Instagram accounts:', error);
      throw error;
    }
  }

  // Create Instagram media object (step 1 of publishing)
  async createMediaObject(instagramAccountId: string, accessToken: string, post: InstagramPost): Promise<{ id: string }> {
    try {
      const params = new URLSearchParams({
        access_token: accessToken,
      });

      // Add media URL based on type
      if (post.media_type === 'IMAGE' && post.image_url) {
        params.append('image_url', post.image_url);
      } else if (post.media_type === 'VIDEO' && post.video_url) {
        params.append('video_url', post.video_url);
      } else if (post.media_type === 'CAROUSEL_ALBUM' && post.children) {
        post.children.forEach(childId => {
          params.append('children', childId);
        });
      }

      if (post.caption) {
        params.append('caption', post.caption);
      }

      params.append('media_type', post.media_type);

      const response = await fetch(`${this.baseUrl}/${instagramAccountId}/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Instagram media creation failed: ${error.error.message}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error creating Instagram media object:', error);
      throw error;
    }
  }

  // Publish Instagram media object (step 2 of publishing)
  async publishMedia(instagramAccountId: string, accessToken: string, creationId: string): Promise<{ id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${instagramAccountId}/media_publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          creation_id: creationId,
          access_token: accessToken,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Instagram media publish failed: ${error.error.message}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error publishing Instagram media:', error);
      throw error;
    }
  }

  // Complete Instagram post workflow
  async createPost(instagramAccountId: string, accessToken: string, post: InstagramPost): Promise<{ id: string; media_id: string }> {
    try {
      // Step 1: Create media object
      const mediaObject = await this.createMediaObject(instagramAccountId, accessToken, post);
      
      // Step 2: Publish media
      const publishedMedia = await this.publishMedia(instagramAccountId, accessToken, mediaObject.id);
      
      return {
        id: mediaObject.id,
        media_id: publishedMedia.id,
      };
    } catch (error) {
      console.error('Error creating Instagram post:', error);
      throw error;
    }
  }

  // Create carousel post (multiple images/videos)
  async createCarouselPost(
    instagramAccountId: string, 
    accessToken: string, 
    items: Array<{ image_url?: string; video_url?: string; media_type: 'IMAGE' | 'VIDEO' }>,
    caption?: string
  ): Promise<{ id: string; media_id: string }> {
    try {
      // Step 1: Create individual media objects for carousel items
      const childrenIds: string[] = [];
      
      for (const item of items) {
        const childMedia = await this.createMediaObject(instagramAccountId, accessToken, {
          ...item,
          media_type: item.media_type,
        });
        childrenIds.push(childMedia.id);
      }

      // Step 2: Create carousel container
      const carouselPost: InstagramPost = {
        media_type: 'CAROUSEL_ALBUM',
        children: childrenIds,
        caption,
      };

      const carouselContainer = await this.createMediaObject(instagramAccountId, accessToken, carouselPost);
      
      // Step 3: Publish carousel
      const publishedCarousel = await this.publishMedia(instagramAccountId, accessToken, carouselContainer.id);
      
      return {
        id: carouselContainer.id,
        media_id: publishedCarousel.id,
      };
    } catch (error) {
      console.error('Error creating Instagram carousel post:', error);
      throw error;
    }
  }

  // Get Instagram media insights
  async getMediaInsights(mediaId: string, accessToken: string): Promise<any> {
    try {
      const metrics = [
        'impressions',
        'reach',
        'engagement',
        'likes',
        'comments',
        'saves',
        'shares'
      ];

      const response = await fetch(
        `${this.baseUrl}/${mediaId}/insights?metric=${metrics.join(',')}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Instagram media insights');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching Instagram media insights:', error);
      throw error;
    }
  }

  // Get user's Instagram media
  async getUserMedia(instagramAccountId: string, accessToken: string, limit = 25): Promise<InstagramMedia[]> {
    try {
      const fields = [
        'id',
        'media_type',
        'media_url',
        'permalink',
        'caption',
        'timestamp',
        'like_count',
        'comments_count'
      ];

      const response = await fetch(
        `${this.baseUrl}/${instagramAccountId}/media?fields=${fields.join(',')}&limit=${limit}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Instagram media');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Instagram media:', error);
      throw error;
    }
  }

  // Get hashtag insights
  async searchHashtags(hashtag: string, instagramAccountId: string, accessToken: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/ig_hashtag_search?user_id=${instagramAccountId}&q=${encodeURIComponent(hashtag)}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to search hashtags');
      }

      return response.json();
    } catch (error) {
      console.error('Error searching Instagram hashtags:', error);
      throw error;
    }
  }

  // Get account insights
  async getAccountInsights(
    instagramAccountId: string, 
    accessToken: string,
    period: 'day' | 'week' | 'days_28' = 'days_28'
  ): Promise<any> {
    try {
      const metrics = [
        'impressions',
        'reach',
        'profile_views',
        'website_clicks',
        'follower_count'
      ];

      const response = await fetch(
        `${this.baseUrl}/${instagramAccountId}/insights?metric=${metrics.join(',')}&period=${period}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Instagram account insights');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching Instagram account insights:', error);
      throw error;
    }
  }

  // Validate Instagram posting requirements
  validatePost(post: InstagramPost): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!post.media_type) {
      errors.push('media_type is required');
    }

    if (post.media_type === 'IMAGE' && !post.image_url) {
      errors.push('image_url is required for IMAGE posts');
    }

    if (post.media_type === 'VIDEO' && !post.video_url) {
      errors.push('video_url is required for VIDEO posts');
    }

    if (post.media_type === 'CAROUSEL_ALBUM' && (!post.children || post.children.length < 2)) {
      errors.push('CAROUSEL_ALBUM requires at least 2 children');
    }

    if (post.caption && post.caption.length > 2200) {
      errors.push('Caption must be 2200 characters or less');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}