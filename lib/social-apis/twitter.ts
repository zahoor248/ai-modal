// Twitter/X API v2 Integration
// Real API implementation for posting to Twitter/X

interface TwitterConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  bearerToken: string; // For API v2
}

interface TwitterTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  scopes: string[];
}

interface TwitterPost {
  text: string;
  media?: {
    media_ids: string[];
  };
  poll?: {
    options: string[];
    duration_minutes: number;
  };
  reply?: {
    in_reply_to_tweet_id: string;
  };
  quote_tweet_id?: string;
  geo?: {
    place_id: string;
  };
}

interface TwitterThread {
  tweets: string[];
  media_ids?: string[][]; // Media for each tweet
}

export class TwitterAPI {
  private config: TwitterConfig;
  private baseUrl = 'https://api.twitter.com/2';
  private uploadUrl = 'https://upload.twitter.com/1.1';

  constructor(config: TwitterConfig) {
    this.config = config;
  }

  // OAuth 2.0 PKCE flow for Twitter API v2
  generateCodeChallenge(): { codeVerifier: string; codeChallenge: string } {
    const codeVerifier = this.generateRandomString(128);
    const codeChallenge = this.base64URLEncode(this.sha256(codeVerifier));
    return { codeVerifier, codeChallenge };
  }

  // Get OAuth authorization URL
  getAuthUrl(codeChallenge: string, state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: [
        'tweet.read',
        'tweet.write',
        'users.read',
        'follows.read',
        'offline.access'
      ].join(' '),
      state: state || '',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `https://twitter.com/i/oauth2/authorize?${params}`;
  }

  // Exchange code for access token
  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<TwitterTokens> {
    try {
      const response = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.config.redirectUri,
          code_verifier: codeVerifier,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Twitter OAuth error: ${error.error_description}`);
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
        scopes: data.scope?.split(' ') || []
      };
    } catch (error) {
      console.error('Error exchanging Twitter code:', error);
      throw error;
    }
  }

  // Create a tweet
  async createTweet(accessToken: string, tweet: TwitterPost): Promise<{ data: { id: string; text: string } }> {
    try {
      const response = await fetch(`${this.baseUrl}/tweets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(tweet),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Twitter post failed: ${error.detail || error.title}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error creating Twitter post:', error);
      throw error;
    }
  }

  // Create a thread
  async createThread(accessToken: string, thread: TwitterThread): Promise<{ tweets: any[] }> {
    const tweets: any[] = [];
    let previousTweetId: string | undefined;

    try {
      for (let i = 0; i < thread.tweets.length; i++) {
        const tweetData: TwitterPost = {
          text: thread.tweets[i],
        };

        // Add media if provided for this tweet
        if (thread.media_ids && thread.media_ids[i] && thread.media_ids[i].length > 0) {
          tweetData.media = {
            media_ids: thread.media_ids[i]
          };
        }

        // Add reply reference for threading (except first tweet)
        if (previousTweetId) {
          tweetData.reply = {
            in_reply_to_tweet_id: previousTweetId
          };
        }

        const result = await this.createTweet(accessToken, tweetData);
        tweets.push(result.data);
        previousTweetId = result.data.id;

        // Add delay between tweets to avoid rate limiting
        if (i < thread.tweets.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return { tweets };
    } catch (error) {
      console.error('Error creating Twitter thread:', error);
      throw error;
    }
  }

  // Upload media to Twitter
  async uploadMedia(accessToken: string, mediaUrl: string, mediaType: 'image' | 'video' | 'gif'): Promise<string> {
    try {
      // For external URLs, you need to download and then upload
      // This is a simplified version - in production, you'd handle file downloads properly
      const response = await fetch(`${this.uploadUrl}/media/upload.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          media_url: mediaUrl,
          media_type: mediaType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Media upload failed: ${error.errors?.[0]?.message}`);
      }

      const data = await response.json();
      return data.media_id_string;
    } catch (error) {
      console.error('Error uploading media to Twitter:', error);
      throw error;
    }
  }

  // Get tweet analytics
  async getTweetAnalytics(tweetId: string, accessToken: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/tweets/${tweetId}?tweet.fields=public_metrics,organic_metrics`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tweet analytics');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching Twitter analytics:', error);
      throw error;
    }
  }

  // Get user's tweets
  async getUserTweets(userId: string, accessToken: string, maxResults = 10): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=created_at,public_metrics`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user tweets');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching user tweets:', error);
      throw error;
    }
  }

  // Search tweets for trending analysis
  async searchTweets(query: string, maxResults = 10): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${maxResults}&tweet.fields=created_at,public_metrics`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.bearerToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search tweets');
      }

      return response.json();
    } catch (error) {
      console.error('Error searching tweets:', error);
      throw error;
    }
  }

  // Get trending topics
  async getTrendingTopics(woeid = 1): Promise<any> {
    try {
      // Note: Trends endpoint requires API v1.1
      const response = await fetch(
        `https://api.twitter.com/1.1/trends/place.json?id=${woeid}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.bearerToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch trending topics');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<TwitterTokens> {
    try {
      const response = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
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
        refreshToken: data.refresh_token || refreshToken,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
        scopes: data.scope?.split(' ') || []
      };
    } catch (error) {
      console.error('Error refreshing Twitter token:', error);
      throw error;
    }
  }

  // Validate tweet content
  validateTweet(text: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!text || text.trim().length === 0) {
      errors.push('Tweet text cannot be empty');
    }

    if (text.length > 280) {
      errors.push('Tweet must be 280 characters or less');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper functions
  private generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  private sha256(plain: string): ArrayBuffer {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
  }

  private base64URLEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}