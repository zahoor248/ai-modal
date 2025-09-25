// LinkedIn API Integration
// Real API implementation for posting to LinkedIn

interface LinkedInConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface LinkedInTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scopes: string[];
}

interface LinkedInPost {
  commentary?: string;
  visibility: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN_MEMBERS';
  distribution?: {
    feedDistribution: 'MAIN_FEED' | 'NONE';
    targetEntities?: string[];
    thirdPartyDistributionChannels?: string[];
  };
  content?: {
    media?: {
      title: string;
      id: string; // Media asset ID
    };
    article?: {
      source: string;
      title: string;
      description?: string;
      thumbnail?: string;
    };
    poll?: {
      question: string;
      options: Array<{
        text: string;
      }>;
      settings: {
        duration: string; // ISO 8601 duration
      };
    };
  };
  lifecycleState?: 'DRAFT' | 'PUBLISHED';
  isReshareDisabledByAuthor?: boolean;
}

interface LinkedInArticle {
  title: string;
  description: string;
  content: string;
  visibility: 'PUBLIC' | 'CONNECTIONS';
  publishedAt?: string;
}

export class LinkedInAPI {
  private config: LinkedInConfig;
  private baseUrl = 'https://api.linkedin.com/v2';

  constructor(config: LinkedInConfig) {
    this.config = config;
  }

  // Get OAuth authorization URL
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: [
        'r_liteprofile',
        'r_emailaddress',
        'w_member_social',
        'r_organization_social',
        'w_organization_social'
      ].join(' '),
      state: state || '',
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  }

  // Exchange code for access token
  async exchangeCodeForToken(code: string): Promise<LinkedInTokens> {
    try {
      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          redirect_uri: this.config.redirectUri,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`LinkedIn OAuth error: ${error.error_description}`);
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
        scopes: data.scope?.split(' ') || []
      };
    } catch (error) {
      console.error('Error exchanging LinkedIn code:', error);
      throw error;
    }
  }

  // Get user profile information
  async getUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn profile');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
      throw error;
    }
  }

  // Create a LinkedIn post
  async createPost(accessToken: string, authorId: string, post: LinkedInPost): Promise<{ id: string }> {
    try {
      const postData = {
        author: `urn:li:person:${authorId}`,
        lifecycleState: post.lifecycleState || 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: post.commentary || '',
            },
            shareMediaCategory: this.getMediaCategory(post),
            media: post.content?.media ? [{
              status: 'READY',
              description: {
                text: post.content.media.title,
              },
              media: post.content.media.id,
              title: {
                text: post.content.media.title,
              },
            }] : undefined,
            ...(post.content?.article && {
              media: [{
                status: 'READY',
                description: {
                  text: post.content.article.description || '',
                },
                originalUrl: post.content.article.source,
                title: {
                  text: post.content.article.title,
                },
                ...(post.content.article.thumbnail && {
                  thumbnails: [{
                    url: post.content.article.thumbnail,
                  }],
                }),
              }],
            }),
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': post.visibility,
        },
        distribution: post.distribution,
      };

      const response = await fetch(`${this.baseUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`LinkedIn post failed: ${error.message}`);
      }

      const result = await response.json();
      return { id: result.id };
    } catch (error) {
      console.error('Error creating LinkedIn post:', error);
      throw error;
    }
  }

  // Upload media asset
  async uploadMedia(accessToken: string, authorId: string, mediaUrl: string, mediaType: 'image' | 'video'): Promise<string> {
    try {
      // Step 1: Register upload
      const registerResponse = await fetch(`${this.baseUrl}/assets?action=registerUpload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: mediaType === 'video' ? ['urn:li:digitalmediaRecipe:feedshare-video'] : ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: `urn:li:person:${authorId}`,
            serviceRelationships: [{
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent',
            }],
          },
        }),
      });

      if (!registerResponse.ok) {
        throw new Error('Failed to register upload');
      }

      const registerData = await registerResponse.json();
      const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const asset = registerData.value.asset;

      // Step 2: Download media from URL
      const mediaResponse = await fetch(mediaUrl);
      if (!mediaResponse.ok) {
        throw new Error('Failed to download media');
      }
      const mediaData = await mediaResponse.blob();

      // Step 3: Upload media
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: mediaData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload media');
      }

      return asset;
    } catch (error) {
      console.error('Error uploading LinkedIn media:', error);
      throw error;
    }
  }

  // Create an article (long-form content)
  async createArticle(accessToken: string, authorId: string, article: LinkedInArticle): Promise<{ id: string }> {
    try {
      const articleData = {
        author: `urn:li:person:${authorId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: article.description,
            },
            shareMediaCategory: 'ARTICLE',
            media: [{
              status: 'READY',
              description: {
                text: article.description,
              },
              originalUrl: `data:text/html;charset=utf-8,${encodeURIComponent(article.content)}`,
              title: {
                text: article.title,
              },
            }],
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': article.visibility,
        },
      };

      const response = await fetch(`${this.baseUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`LinkedIn article creation failed: ${error.message}`);
      }

      const result = await response.json();
      return { id: result.id };
    } catch (error) {
      console.error('Error creating LinkedIn article:', error);
      throw error;
    }
  }

  // Get post analytics
  async getPostAnalytics(postId: string, accessToken: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/socialMetadata/${postId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn post analytics');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching LinkedIn post analytics:', error);
      throw error;
    }
  }

  // Get user's posts
  async getUserPosts(authorId: string, accessToken: string, count = 10): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/ugcPosts?authors=List(urn:li:person:${authorId})&count=${count}&sortBy=CREATED`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn user posts');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching LinkedIn user posts:', error);
      throw error;
    }
  }

  // Get company/organization information
  async getCompany(companyId: string, accessToken: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/organizations/${companyId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn company');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching LinkedIn company:', error);
      throw error;
    }
  }

  // Create company post
  async createCompanyPost(accessToken: string, companyId: string, post: LinkedInPost): Promise<{ id: string }> {
    try {
      const postData = {
        author: `urn:li:organization:${companyId}`,
        lifecycleState: post.lifecycleState || 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: post.commentary || '',
            },
            shareMediaCategory: this.getMediaCategory(post),
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': post.visibility,
        },
      };

      const response = await fetch(`${this.baseUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`LinkedIn company post failed: ${error.message}`);
      }

      const result = await response.json();
      return { id: result.id };
    } catch (error) {
      console.error('Error creating LinkedIn company post:', error);
      throw error;
    }
  }

  // Validate post content
  validatePost(post: LinkedInPost): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!post.commentary || post.commentary.trim().length === 0) {
      errors.push('Post commentary cannot be empty');
    }

    if (post.commentary && post.commentary.length > 3000) {
      errors.push('Post commentary must be 3000 characters or less');
    }

    if (!post.visibility) {
      errors.push('Post visibility is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper method to determine media category
  private getMediaCategory(post: LinkedInPost): string {
    if (post.content?.media) {
      return 'IMAGE'; // or 'VIDEO' based on media type
    }
    if (post.content?.article) {
      return 'ARTICLE';
    }
    if (post.content?.poll) {
      return 'POLL';
    }
    return 'NONE';
  }

  // Refresh access token (LinkedIn tokens don't refresh automatically)
  async validateToken(accessToken: string): Promise<{ isValid: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/people/~:(id)`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      return { isValid: response.ok };
    } catch (error) {
      console.error('Error validating LinkedIn token:', error);
      return { isValid: false };
    }
  }
}