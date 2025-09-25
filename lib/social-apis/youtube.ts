// YouTube Data API v3 Integration
// Real API implementation for posting to YouTube

interface YouTubeConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  apiKey: string;
}

interface YouTubeTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  scopes: string[];
}

interface YouTubeVideo {
  title: string;
  description?: string;
  tags?: string[];
  categoryId?: string;
  defaultLanguage?: string;
  privacyStatus: 'private' | 'public' | 'unlisted';
  publishAt?: string; // ISO 8601 format for scheduled publishing
  thumbnail?: string;
  playlistId?: string;
}

interface YouTubeVideoUpload extends YouTubeVideo {
  videoFile?: Blob | File;
  videoUrl?: string; // For external video URLs
}

export class YouTubeAPI {
  private config: YouTubeConfig;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';
  private uploadUrl = 'https://www.googleapis.com/upload/youtube/v3';

  constructor(config: YouTubeConfig) {
    this.config = config;
  }

  // Get OAuth authorization URL
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: [
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.readonly'
      ].join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      state: state || '',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  // Exchange code for access token
  async exchangeCodeForToken(code: string): Promise<YouTubeTokens> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.config.redirectUri,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`YouTube OAuth error: ${error.error_description}`);
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
        scopes: data.scope?.split(' ') || []
      };
    } catch (error) {
      console.error('Error exchanging YouTube code:', error);
      throw error;
    }
  }

  // Upload video to YouTube
  async uploadVideo(accessToken: string, video: YouTubeVideoUpload): Promise<{ id: string; etag: string }> {
    try {
      // Step 1: Initialize upload
      const metadata = {
        snippet: {
          title: video.title,
          description: video.description || '',
          tags: video.tags || [],
          categoryId: video.categoryId || '22', // People & Blogs
          defaultLanguage: video.defaultLanguage || 'en',
        },
        status: {
          privacyStatus: video.privacyStatus,
          publishAt: video.publishAt,
        },
      };

      if (!video.videoFile && !video.videoUrl) {
        throw new Error('Either videoFile or videoUrl must be provided');
      }

      // For resumable upload (recommended for large files)
      const uploadResponse = await fetch(`${this.uploadUrl}/videos?uploadType=resumable&part=snippet,status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Upload-Content-Type': 'video/*',
        },
        body: JSON.stringify(metadata),
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(`YouTube upload initialization failed: ${error.error.message}`);
      }

      const uploadUrl = uploadResponse.headers.get('Location');
      if (!uploadUrl) {
        throw new Error('Upload URL not received from YouTube');
      }

      // Step 2: Upload video data
      let videoData: Blob;
      
      if (video.videoFile) {
        videoData = video.videoFile;
      } else if (video.videoUrl) {
        // Download video from URL
        const videoResponse = await fetch(video.videoUrl);
        if (!videoResponse.ok) {
          throw new Error('Failed to download video from URL');
        }
        videoData = await videoResponse.blob();
      } else {
        throw new Error('No video data provided');
      }

      const finalResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'video/*',
        },
        body: videoData,
      });

      if (!finalResponse.ok) {
        const error = await finalResponse.json();
        throw new Error(`YouTube video upload failed: ${error.error.message}`);
      }

      const result = await finalResponse.json();

      // Step 3: Update thumbnail if provided
      if (video.thumbnail && result.id) {
        await this.updateThumbnail(accessToken, result.id, video.thumbnail);
      }

      return {
        id: result.id,
        etag: result.etag,
      };
    } catch (error) {
      console.error('Error uploading YouTube video:', error);
      throw error;
    }
  }

  // Update video thumbnail
  async updateThumbnail(accessToken: string, videoId: string, thumbnailUrl: string): Promise<void> {
    try {
      // Download thumbnail
      const thumbnailResponse = await fetch(thumbnailUrl);
      if (!thumbnailResponse.ok) {
        throw new Error('Failed to download thumbnail');
      }
      
      const thumbnailData = await thumbnailResponse.blob();

      const response = await fetch(`${this.uploadUrl}/thumbnails/set?videoId=${videoId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'image/jpeg',
        },
        body: thumbnailData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.warn('Thumbnail update failed:', error.error.message);
        // Don't throw here as video upload was successful
      }
    } catch (error) {
      console.warn('Error updating YouTube thumbnail:', error);
      // Don't throw here as video upload was successful
    }
  }

  // Get video analytics
  async getVideoAnalytics(
    videoId: string, 
    accessToken: string,
    metrics: string[] = ['views', 'likes', 'comments', 'estimatedMinutesWatched']
  ): Promise<any> {
    try {
      const params = new URLSearchParams({
        ids: `video==${videoId}`,
        metrics: metrics.join(','),
        dimensions: 'day',
        sort: 'day',
      });

      const response = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch YouTube analytics');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching YouTube analytics:', error);
      throw error;
    }
  }

  // Get channel videos
  async getChannelVideos(channelId: string, accessToken: string, maxResults = 25): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch channel videos');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      throw error;
    }
  }

  // Search YouTube videos for trends
  async searchVideos(
    query: string,
    maxResults = 25,
    regionCode = 'US',
    order: 'relevance' | 'date' | 'rating' | 'viewCount' | 'title' = 'relevance'
  ): Promise<any> {
    try {
      const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: maxResults.toString(),
        order: order,
        regionCode: regionCode,
        key: this.config.apiKey,
      });

      const response = await fetch(`${this.baseUrl}/search?${params}`);

      if (!response.ok) {
        throw new Error('Failed to search YouTube videos');
      }

      return response.json();
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      throw error;
    }
  }

  // Get trending videos
  async getTrendingVideos(regionCode = 'US', categoryId?: string): Promise<any> {
    try {
      const params = new URLSearchParams({
        part: 'snippet,statistics',
        chart: 'mostPopular',
        regionCode: regionCode,
        maxResults: '50',
        key: this.config.apiKey,
      });

      if (categoryId) {
        params.append('videoCategoryId', categoryId);
      }

      const response = await fetch(`${this.baseUrl}/videos?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch trending videos');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching trending YouTube videos:', error);
      throw error;
    }
  }

  // Get video categories
  async getVideoCategories(regionCode = 'US'): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/videoCategories?part=snippet&regionCode=${regionCode}&key=${this.config.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch video categories');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching video categories:', error);
      throw error;
    }
  }

  // Create playlist
  async createPlaylist(accessToken: string, title: string, description?: string, privacyStatus: 'private' | 'public' | 'unlisted' = 'private'): Promise<{ id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/playlists?part=snippet,status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snippet: {
            title: title,
            description: description || '',
          },
          status: {
            privacyStatus: privacyStatus,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Playlist creation failed: ${error.error.message}`);
      }

      const result = await response.json();
      return { id: result.id };
    } catch (error) {
      console.error('Error creating YouTube playlist:', error);
      throw error;
    }
  }

  // Add video to playlist
  async addVideoToPlaylist(accessToken: string, playlistId: string, videoId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/playlistItems?part=snippet`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snippet: {
            playlistId: playlistId,
            resourceId: {
              kind: 'youtube#video',
              videoId: videoId,
            },
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Adding video to playlist failed: ${error.error.message}`);
      }
    } catch (error) {
      console.error('Error adding video to playlist:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<YouTubeTokens> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Token refresh failed: ${error.error_description}`);
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: refreshToken, // Refresh token doesn't change
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
        scopes: data.scope?.split(' ') || []
      };
    } catch (error) {
      console.error('Error refreshing YouTube token:', error);
      throw error;
    }
  }

  // Validate video upload
  validateVideo(video: YouTubeVideoUpload): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!video.title || video.title.trim().length === 0) {
      errors.push('Video title is required');
    }

    if (video.title && video.title.length > 100) {
      errors.push('Video title must be 100 characters or less');
    }

    if (video.description && video.description.length > 5000) {
      errors.push('Video description must be 5000 characters or less');
    }

    if (video.tags && video.tags.length > 500) {
      errors.push('Maximum 500 tags allowed');
    }

    if (!video.videoFile && !video.videoUrl) {
      errors.push('Either video file or video URL must be provided');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}