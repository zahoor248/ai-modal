"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { SocialMediaContentBuilder } from "@/components/social-media/SocialMediaContentBuilder";
import { toast } from "sonner";

export default function SocialBuilderPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [user, setUser] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserAndStories();
  }, []);

  const loadUserAndStories = async () => {
    try {
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Load user stories
      const { data: storiesData } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (storiesData) {
        setStories(storiesData);
        // Select the first story by default if available
        if (storiesData.length > 0) {
          setSelectedStory(storiesData[0]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load stories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContent = async (content: any) => {
    try {
      const { error } = await supabase
        .from('social_media_posts')
        .insert({
          user_id: user.id,
          story_id: content.storyId,
          platforms: content.platforms,
          content_type: content.contentType,
          caption: content.caption,
          hashtags: content.hashtags,
          media_urls: content.mediaFiles,
          status: 'draft',
          scheduled_at: content.scheduledDate || null,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  };

  const handlePublishContent = async (content: any, platforms: string[]) => {
    try {
      // In a real implementation, this would connect to social media APIs
      // For now, we'll just save it as published
      const { error } = await supabase
        .from('social_media_posts')
        .insert({
          user_id: user.id,
          story_id: content.storyId,
          platforms: platforms,
          content_type: content.contentType,
          caption: content.caption,
          hashtags: content.hashtags,
          media_urls: content.mediaFiles,
          status: content.scheduledDate ? 'scheduled' : 'published',
          scheduled_at: content.scheduledDate || null,
          published_at: content.scheduledDate ? null : new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Here you would integrate with actual social media APIs
      await publishToSocialPlatforms(content, platforms);
      
    } catch (error) {
      console.error('Error publishing content:', error);
      toast.error('Failed to publish content');
    }
  };

  const publishToSocialPlatforms = async (content: any, platforms: string[]) => {
    // This would integrate with actual social media APIs
    // For now, we'll simulate the publishing process
    
    for (const platform of platforms) {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, you would use the platform's API:
        // - TikTok: https://developers.tiktok.com/
        // - YouTube: https://developers.google.com/youtube/v3
        // - Instagram: https://developers.facebook.com/docs/instagram
        // - Facebook: https://developers.facebook.com/docs/pages-api
        
        console.log(`Publishing to ${platform}:`, {
          caption: content.caption,
          hashtags: content.hashtags,
          mediaFiles: content.mediaFiles
        });
        
        toast.success(`Published to ${platform}!`);
      } catch (error) {
        console.error(`Error publishing to ${platform}:`, error);
        toast.error(`Failed to publish to ${platform}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-2xl font-bold text-foreground">Loading Social Media Builder</h2>
          <p className="text-muted-foreground">Preparing your content tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">Social Media Content Builder</h1>
            {stories.length > 0 && (
              <select
                value={selectedStory?.id || ''}
                onChange={(e) => {
                  const story = stories.find(s => s.id === e.target.value);
                  setSelectedStory(story);
                }}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="">Select a story...</option>
                {stories.map((story) => (
                  <option key={story.id} value={story.id}>
                    {story.story_title}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/generate')}
              className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80"
            >
              Create New Story
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6">
        {selectedStory ? (
          <SocialMediaContentBuilder
            story={selectedStory}
            onSave={handleSaveContent}
            onPublish={handlePublishContent}
          />
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">No Story Selected</h3>
              <p className="text-muted-foreground mb-6">
                Select a story from the dropdown above or create a new one to start building social media content.
              </p>
              <button
                onClick={() => router.push('/generate')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Create Your First Story
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}