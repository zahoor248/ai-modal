// Facebook Graph API Integration
// Real API implementation for posting to Facebook/Instagram

interface FacebookConfig {
  appId: string;
  appSecret: string;
  redirectUri: string;
}

interface FacebookTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scopes: string[];
}

interface FacebookPost {
  message?: string;
  link?: string;
  media?: {
    url: string;
    type: 'photo' | 'video';
  }[];
  scheduled_publish_time?: number;
  published?: boolean;
}

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
  tasks: string[];
}

export class FacebookAPI {
  private config: FacebookConfig;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(config: FacebookConfig) {
    this.config = config;
  }

  // Step 1: Get OAuth authorization URL
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.appId,
      redirect_uri: this.config.redirectUri,
      scope: [
        'pages_manage_posts',
        'pages_read_engagement',
        'pages_show_list',
        'publish_to_groups',
        'instagram_basic',
        'instagram_content_publish'
      ].join(','),
      response_type: 'code',
      state: state || ''
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params}`;
  }

  // Step 2: Exchange code for access token
  async exchangeCodeForToken(code: string): Promise<FacebookTokens> {
    try {
      const response = await fetch(`${this.baseUrl}/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.appId,
          client_secret: this.config.appSecret,
          redirect_uri: this.config.redirectUri,
          code: code,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Facebook OAuth error: ${error.error.message}`);
      }

      const data = await response.json();
      
      // Get long-lived token
      const longLivedToken = await this.getLongLivedToken(data.access_token);

      return {
        accessToken: longLivedToken.access_token,
        expiresAt: new Date(Date.now() + longLivedToken.expires_in * 1000),
        scopes: data.scope?.split(',') || []
      };
    } catch (error) {
      console.error('Error exchanging Facebook code:', error);
      throw error;
    }
  }

  // Get long-lived access token (60 days)
  private async getLongLivedToken(shortToken: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/oauth/access_token?` + new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: this.config.appId,
      client_secret: this.config.appSecret,
      fb_exchange_token: shortToken,
    }));

    if (!response.ok) {
      throw new Error('Failed to get long-lived token');
    }

    return response.json();
  }

  // Get user's Facebook pages
  async getUserPages(accessToken: string): Promise<FacebookPage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/me/accounts?access_token=${accessToken}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Facebook pages');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Facebook pages:', error);
      throw error;
    }
  }

  // Post to Facebook page
  async createPost(pageId: string, pageAccessToken: string, post: FacebookPost): Promise<{ id: string; post_id: string }> {
    try {
      const formData = new FormData();
      
      if (post.message) {
        formData.append('message', post.message);
      }

      if (post.link) {
        formData.append('link', post.link);
      }

      if (post.scheduled_publish_time) {
        formData.append('scheduled_publish_time', post.scheduled_publish_time.toString());
        formData.append('published', 'false');
      }

      if (post.media && post.media.length > 0) {
        // Handle media upload for Facebook
        const mediaIds = await this.uploadMedia(pageId, pageAccessToken, post.media);
        if (mediaIds.length === 1) {
          // Single media post
          formData.append('object_attachment', mediaIds[0]);
        } else if (mediaIds.length > 1) {
          // Multiple media post
          const attachedMedia = mediaIds.map(id => ({ media_fbid: id }));
          formData.append('attached_media', JSON.stringify(attachedMedia));
        }
      }

      formData.append('access_token', pageAccessToken);

      const response = await fetch(`${this.baseUrl}/${pageId}/feed`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Facebook post failed: ${error.error.message}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error creating Facebook post:', error);
      throw error;
    }
  }

  // Upload media to Facebook
  private async uploadMedia(pageId: string, pageAccessToken: string, media: FacebookPost['media']): Promise<string[]> {
    const mediaIds: string[] = [];

    for (const item of media || []) {
      try {
        const formData = new FormData();
        
        // For external URLs, Facebook will fetch the media
        if (item.url.startsWith('http')) {
          formData.append('url', item.url);
        } else {
          // For file uploads, you'd need to handle file data
          throw new Error('Direct file upload not implemented - use URLs');
        }

        formData.append('access_token', pageAccessToken);

        const endpoint = item.type === 'video' ? 'videos' : 'photos';
        const response = await fetch(`${this.baseUrl}/${pageId}/${endpoint}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Media upload failed: ${error.error.message}`);
        }

        const result = await response.json();
        mediaIds.push(result.id);
      } catch (error) {
        console.error('Error uploading media to Facebook:', error);
        // Continue with other media items
      }
    }

    return mediaIds;
  }

  // Get post insights/analytics
  async getPostInsights(postId: string, accessToken: string): Promise<any> {
    try {
      const metrics = [
        'post_impressions',
        'post_engaged_users',
        'post_clicks',
        'post_reactions_by_type_total'
      ];

      const response = await fetch(
        `${this.baseUrl}/${postId}/insights?metric=${metrics.join(',')}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch post insights');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching Facebook post insights:', error);
      throw error;
    }
  }

  // Validate and refresh access token
  async validateToken(accessToken: string): Promise<{ isValid: boolean; expiresAt?: Date; scopes?: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/me?access_token=${accessToken}`);
      
      if (!response.ok) {
        return { isValid: false };
      }

      // Get token info
      const tokenInfo = await fetch(`${this.baseUrl}/debug_token?input_token=${accessToken}&access_token=${this.config.appId}|${this.config.appSecret}`);
      
      if (tokenInfo.ok) {
        const data = await tokenInfo.json();
        const tokenData = data.data;
        
        return {
          isValid: tokenData.is_valid,
          expiresAt: tokenData.expires_at ? new Date(tokenData.expires_at * 1000) : undefined,
          scopes: tokenData.scopes
        };
      }

      return { isValid: true };
    } catch (error) {
      console.error('Error validating Facebook token:', error);
      return { isValid: false };
    }
  }

  // Refresh token if needed
  async refreshTokenIfNeeded(accessToken: string): Promise<string> {
    const validation = await this.validateToken(accessToken);
    
    if (!validation.isValid) {
      throw new Error('Token is invalid and cannot be refreshed');
    }

    // Facebook long-lived tokens don't need manual refresh
    // They auto-refresh when used within 60 days
    return accessToken;
  }
}