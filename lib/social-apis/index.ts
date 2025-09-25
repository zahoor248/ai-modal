// Unified Social Media API Manager
// Centralized management for all social media platform integrations

import { FacebookAPI } from './facebook';
import { InstagramAPI } from './instagram';
import { TwitterAPI } from './twitter';
import { YouTubeAPI } from './youtube';
import { LinkedInAPI } from './linkedin';
import { TikTokAPI } from './tiktok';

export interface SocialMediaConfig {
  facebook: {
    appId: string;
    appSecret: string;
    redirectUri: string;
  };
  instagram: {
    appId: string;
    appSecret: string;
    redirectUri: string;
  };
  twitter: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    bearerToken: string;
  };
  youtube: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    apiKey: string;
  };
  linkedin: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  tiktok: {
    clientKey: string;
    clientSecret: string;
    redirectUri: string;
  };
}

export interface UnifiedPost {
  platform: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'linkedin' | 'tiktok';
  content: {
    text?: string;
    title?: string;
    description?: string;
    hashtags?: string[];
    media?: Array<{
      url: string;
      type: 'image' | 'video';
      thumbnail?: string;
    }>;
  };
  privacy: 'public' | 'private' | 'connections' | 'unlisted';
  scheduling?: {
    publishAt: Date;
    timezone: string;
  };
  platformSpecific?: Record<string, any>;
}

export interface UnifiedAnalytics {
  platform: string;
  postId: string;
  metrics: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    engagement_rate?: number;
    reach?: number;
    impressions?: number;
  };
  date: string;
}

export interface ConnectionStatus {
  platform: string;
  connected: boolean;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  expiresAt?: Date;
  scopes?: string[];
  error?: string;
}

export class SocialMediaManager {
  private apis: {
    facebook: FacebookAPI;
    instagram: InstagramAPI;
    twitter: TwitterAPI;
    youtube: YouTubeAPI;
    linkedin: LinkedInAPI;
    tiktok: TikTokAPI;
  };

  constructor(config: SocialMediaConfig) {
    this.apis = {
      facebook: new FacebookAPI(config.facebook),
      instagram: new InstagramAPI(config.instagram),
      twitter: new TwitterAPI(config.twitter),
      youtube: new YouTubeAPI(config.youtube),
      linkedin: new LinkedInAPI(config.linkedin),
      tiktok: new TikTokAPI(config.tiktok),
    };
  }

  // Get OAuth authorization URLs for all platforms
  getAuthUrls(state?: string): Record<string, string> {
    return {
      facebook: this.apis.facebook.getAuthUrl(state),
      instagram: this.apis.facebook.getAuthUrl(state), // Uses Facebook OAuth
      twitter: this.apis.twitter.getAuthUrl(this.apis.twitter.generateCodeChallenge().codeChallenge, state),
      youtube: this.apis.youtube.getAuthUrl(state),
      linkedin: this.apis.linkedin.getAuthUrl(state),
      tiktok: this.apis.tiktok.getAuthUrl(state),
    };
  }

  // Exchange authorization codes for tokens
  async exchangeCodeForToken(platform: string, code: string, codeVerifier?: string): Promise<any> {
    switch (platform) {
      case 'facebook':
        return this.apis.facebook.exchangeCodeForToken(code);
      case 'instagram':
        return this.apis.facebook.exchangeCodeForToken(code);
      case 'twitter':
        if (!codeVerifier) throw new Error('Code verifier required for Twitter');
        return this.apis.twitter.exchangeCodeForToken(code, codeVerifier);
      case 'youtube':
        return this.apis.youtube.exchangeCodeForToken(code);
      case 'linkedin':
        return this.apis.linkedin.exchangeCodeForToken(code);
      case 'tiktok':
        return this.apis.tiktok.exchangeCodeForToken(code);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  // Publish unified post to any platform
  async publishPost(post: UnifiedPost, accessTokens: Record<string, string>): Promise<{ success: boolean; postId?: string; error?: string }> {
    const platform = post.platform;
    const accessToken = accessTokens[platform];

    if (!accessToken) {
      return { success: false, error: 'Access token not found for platform' };
    }

    try {
      let result: any;

      switch (platform) {
        case 'facebook':
          // Assuming we have pageId and pageAccessToken
          const pageId = post.platformSpecific?.pageId;
          if (!pageId) throw new Error('Facebook page ID required');
          
          result = await this.apis.facebook.createPost(pageId, accessToken, {
            message: post.content.text,
            link: post.content.media?.[0]?.url,
            scheduled_publish_time: post.scheduling?.publishAt ? Math.floor(post.scheduling.publishAt.getTime() / 1000) : undefined,
          });
          break;

        case 'instagram':
          const instagramAccountId = post.platformSpecific?.instagramAccountId;
          if (!instagramAccountId) throw new Error('Instagram account ID required');

          result = await this.apis.instagram.createPost(instagramAccountId, accessToken, {
            image_url: post.content.media?.find(m => m.type === 'image')?.url,
            video_url: post.content.media?.find(m => m.type === 'video')?.url,
            caption: post.content.text,
            media_type: post.content.media?.[0]?.type === 'video' ? 'VIDEO' : 'IMAGE',
          });
          break;

        case 'twitter':
          if (post.content.hashtags && post.content.hashtags.length > 0) {
            post.content.text += ' ' + post.content.hashtags.join(' ');
          }
          
          result = await this.apis.twitter.createTweet(accessToken, {
            text: post.content.text || '',
          });
          break;

        case 'youtube':
          if (!post.content.media?.[0] || post.content.media[0].type !== 'video') {
            throw new Error('YouTube requires video content');
          }

          result = await this.apis.youtube.uploadVideo(accessToken, {
            title: post.content.title || 'Untitled Video',
            description: post.content.description,
            tags: post.content.hashtags,
            privacyStatus: post.privacy === 'public' ? 'public' : post.privacy === 'private' ? 'private' : 'unlisted',
            videoUrl: post.content.media[0].url,
          });
          break;

        case 'linkedin':
          const authorId = post.platformSpecific?.authorId;
          if (!authorId) throw new Error('LinkedIn author ID required');

          result = await this.apis.linkedin.createPost(accessToken, authorId, {
            commentary: post.content.text,
            visibility: post.privacy === 'public' ? 'PUBLIC' : 'CONNECTIONS',
          });
          break;

        case 'tiktok':
          if (!post.content.media?.[0] || post.content.media[0].type !== 'video') {
            throw new Error('TikTok requires video content');
          }

          // Download video for TikTok upload
          const videoResponse = await fetch(post.content.media[0].url);
          const videoBlob = await videoResponse.blob();

          result = await this.apis.tiktok.uploadVideo(accessToken, {
            title: post.content.title || post.content.text || 'Untitled Video',
            description: post.content.description,
            privacy_level: post.privacy === 'public' ? 'PUBLIC_TO_EVERYONE' : 'SELF_ONLY',
            video_file: videoBlob,
          });
          break;

        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

      return {
        success: true,
        postId: result.id || result.media_id || result.publish_id,
      };
    } catch (error) {
      console.error(`Error publishing to ${platform}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get analytics from all connected platforms
  async getUnifiedAnalytics(
    platforms: string[],
    accessTokens: Record<string, string>,
    postIds: Record<string, string>
  ): Promise<UnifiedAnalytics[]> {
    const analytics: UnifiedAnalytics[] = [];

    for (const platform of platforms) {
      const accessToken = accessTokens[platform];
      const postId = postIds[platform];

      if (!accessToken || !postId) continue;

      try {
        let data: any;

        switch (platform) {
          case 'facebook':
            data = await this.apis.facebook.getPostInsights(postId, accessToken);
            break;
          case 'instagram':
            data = await this.apis.instagram.getMediaInsights(postId, accessToken);
            break;
          case 'twitter':
            data = await this.apis.twitter.getTweetAnalytics(postId, accessToken);
            break;
          case 'youtube':
            data = await this.apis.youtube.getVideoAnalytics(postId, accessToken);
            break;
          case 'linkedin':
            data = await this.apis.linkedin.getPostAnalytics(postId, accessToken);
            break;
          case 'tiktok':
            data = await this.apis.tiktok.getVideoAnalytics(accessToken, [postId]);
            break;
        }

        if (data) {
          analytics.push({
            platform,
            postId,
            metrics: this.normalizeMetrics(platform, data),
            date: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error(`Error fetching analytics for ${platform}:`, error);
      }
    }

    return analytics;
  }

  // Get trending content from all platforms
  async getTrendingContent(platforms: string[], accessTokens: Record<string, string>): Promise<Record<string, any>> {
    const trends: Record<string, any> = {};

    for (const platform of platforms) {
      const accessToken = accessTokens[platform];
      
      try {
        let data: any;

        switch (platform) {
          case 'twitter':
            data = await this.apis.twitter.getTrendingTopics();
            break;
          case 'youtube':
            data = await this.apis.youtube.getTrendingVideos();
            break;
          case 'tiktok':
            if (accessToken) {
              data = await this.apis.tiktok.searchHashtags('trending', accessToken);
            }
            break;
          case 'instagram':
            // Instagram trending is handled through hashtag research
            data = { message: 'Use hashtag research for Instagram trending' };
            break;
          case 'linkedin':
            // LinkedIn doesn't have a public trending API
            data = { message: 'LinkedIn trending not available via API' };
            break;
          case 'facebook':
            // Facebook trending is limited
            data = { message: 'Facebook trending limited via API' };
            break;
        }

        if (data) {
          trends[platform] = data;
        }
      } catch (error) {
        console.error(`Error fetching trends for ${platform}:`, error);
        trends[platform] = { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return trends;
  }

  // Check connection status for all platforms
  async checkConnectionStatus(accessTokens: Record<string, string>): Promise<ConnectionStatus[]> {
    const statuses: ConnectionStatus[] = [];

    for (const [platform, accessToken] of Object.entries(accessTokens)) {
      if (!accessToken) {
        statuses.push({
          platform,
          connected: false,
          error: 'No access token',
        });
        continue;
      }

      try {
        let isValid = false;
        let userInfo: any = {};

        switch (platform) {
          case 'facebook':
            const fbValidation = await this.apis.facebook.validateToken(accessToken);
            isValid = fbValidation.isValid;
            break;
          case 'twitter':
            // Twitter validation would need user info call
            isValid = true; // Assume valid for now
            break;
          case 'youtube':
            // YouTube validation would need user info call
            isValid = true; // Assume valid for now
            break;
          case 'linkedin':
            const liValidation = await this.apis.linkedin.validateToken(accessToken);
            isValid = liValidation.isValid;
            break;
          case 'tiktok':
            userInfo = await this.apis.tiktok.getUserInfo(accessToken);
            isValid = !!userInfo.open_id;
            break;
          case 'instagram':
            // Instagram uses Facebook validation
            const igValidation = await this.apis.facebook.validateToken(accessToken);
            isValid = igValidation.isValid;
            break;
        }

        statuses.push({
          platform,
          connected: isValid,
          username: userInfo.username || userInfo.display_name,
          displayName: userInfo.display_name || userInfo.name,
          avatarUrl: userInfo.avatar_url || userInfo.avatar_url_100,
        });
      } catch (error) {
        statuses.push({
          platform,
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return statuses;
  }

  // Refresh tokens for platforms that support it
  async refreshTokens(platform: string, refreshToken: string): Promise<any> {
    switch (platform) {
      case 'twitter':
        return this.apis.twitter.refreshToken(refreshToken);
      case 'youtube':
        return this.apis.youtube.refreshToken(refreshToken);
      case 'tiktok':
        return this.apis.tiktok.refreshToken(refreshToken);
      default:
        throw new Error(`Token refresh not supported for ${platform}`);
    }
  }

  // Normalize metrics across platforms
  private normalizeMetrics(platform: string, data: any): UnifiedAnalytics['metrics'] {
    const metrics: UnifiedAnalytics['metrics'] = {};

    // Platform-specific metric mapping
    switch (platform) {
      case 'facebook':
      case 'instagram':
        if (data.data) {
          data.data.forEach((metric: any) => {
            if (metric.name === 'impressions') metrics.impressions = metric.values[0].value;
            if (metric.name === 'reach') metrics.reach = metric.values[0].value;
            if (metric.name === 'engagement') metrics.likes = metric.values[0].value;
          });
        }
        break;
      
      case 'twitter':
        if (data.data?.public_metrics) {
          const m = data.data.public_metrics;
          metrics.views = m.impression_count;
          metrics.likes = m.like_count;
          metrics.comments = m.reply_count;
          metrics.shares = m.retweet_count;
        }
        break;
      
      case 'youtube':
        if (data.rows) {
          const latest = data.rows[data.rows.length - 1];
          metrics.views = latest[0];
          metrics.likes = latest[1];
          metrics.comments = latest[2];
        }
        break;
      
      case 'tiktok':
        if (data.data?.videos) {
          const video = data.data.videos[0];
          metrics.views = video.view_count;
          metrics.likes = video.like_count;
          metrics.comments = video.comment_count;
          metrics.shares = video.share_count;
        }
        break;
    }

    return metrics;
  }

  // Get API instance for specific platform
  getAPI(platform: string): any {
    return this.apis[platform as keyof typeof this.apis];
  }
}

// Export individual APIs
export {
  FacebookAPI,
  InstagramAPI,
  TwitterAPI,
  YouTubeAPI,
  LinkedInAPI,
  TikTokAPI,
};

// Export types
export * from './facebook';
export * from './instagram';
export * from './twitter';
export * from './youtube';
export * from './linkedin';
export * from './tiktok';