"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Sparkles,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Settings,
  Target,
  Users,
  TrendingUp,
  MessageSquare,
  Video,
  Image,
  Type,
  Hash,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  Copy,
  Download,
  RefreshCw
} from "lucide-react";

interface ContentSettings {
  age_group: 'kids' | 'teens' | 'adults' | 'seniors';
  content_type: 'post' | 'story' | 'reel' | 'video_script' | 'carousel' | 'thread';
  category: 'educational' | 'entertainment' | 'promotional' | 'inspirational' | 'news' | 'lifestyle';
  tone: 'casual' | 'professional' | 'funny' | 'serious' | 'friendly' | 'energetic';
  length: 'short' | 'medium' | 'long';
  include_hashtags: boolean;
  include_cta: boolean;
  include_emojis: boolean;
  creativity_level: number; // 1-10
}

interface PlatformContent {
  platform: string;
  content: string;
  hashtags: string[];
  character_count: number;
  optimized_for: string[];
  status: 'generating' | 'completed' | 'error';
}

const PLATFORMS = [
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: Instagram, 
    color: 'from-pink-500 to-purple-600',
    limits: { post: 2200, story: 2200 },
    features: ['hashtags', 'mentions', 'emojis', 'stories']
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: Facebook, 
    color: 'from-blue-600 to-blue-700',
    limits: { post: 63206, story: 500 },
    features: ['long_form', 'links', 'events']
  },
  { 
    id: 'twitter', 
    name: 'Twitter/X', 
    icon: Twitter, 
    color: 'from-sky-400 to-blue-500',
    limits: { tweet: 280, thread: 280 },
    features: ['threads', 'hashtags', 'mentions']
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: Youtube, 
    color: 'from-red-500 to-red-600',
    limits: { description: 5000, title: 100 },
    features: ['long_descriptions', 'chapters', 'timestamps']
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: () => <div className="text-sm font-bold">TT</div>, 
    color: 'from-black to-gray-800',
    limits: { caption: 2200, bio: 80 },
    features: ['hashtags', 'trends', 'music']
  }
];

const AGE_GROUPS = [
  { id: 'kids', name: 'Kids (5-12)', desc: 'Simple, fun, educational content' },
  { id: 'teens', name: 'Teens (13-19)', desc: 'Trendy, relatable, energetic content' },
  { id: 'adults', name: 'Adults (20-64)', desc: 'Professional, informative content' },
  { id: 'seniors', name: 'Seniors (65+)', desc: 'Clear, respectful, accessible content' }
];

const CONTENT_TYPES = [
  { id: 'post', name: 'Social Post', desc: 'Regular social media post', icon: MessageSquare },
  { id: 'story', name: 'Story/Status', desc: 'Short-form story content', icon: Image },
  { id: 'reel', name: 'Reel/Short', desc: 'Video reel description', icon: Video },
  { id: 'video_script', name: 'Video Script', desc: 'Full video script with timestamps', icon: Video },
  { id: 'carousel', name: 'Carousel', desc: 'Multi-slide content', icon: Type },
  { id: 'thread', name: 'Thread', desc: 'Multi-part thread content', icon: Hash }
];

const CATEGORIES = [
  { id: 'educational', name: 'Educational', desc: 'Teaching and learning content' },
  { id: 'entertainment', name: 'Entertainment', desc: 'Fun and engaging content' },
  { id: 'promotional', name: 'Promotional', desc: 'Product or service promotion' },
  { id: 'inspirational', name: 'Inspirational', desc: 'Motivational content' },
  { id: 'news', name: 'News & Updates', desc: 'Current events and announcements' },
  { id: 'lifestyle', name: 'Lifestyle', desc: 'Daily life and personal content' }
];

export default function AdvancedContentBuilderPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Content Input
  const [originalContent, setOriginalContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  
  // Content Settings
  const [contentSettings, setContentSettings] = useState<ContentSettings>({
    age_group: 'adults',
    content_type: 'post',
    category: 'educational',
    tone: 'friendly',
    length: 'medium',
    include_hashtags: true,
    include_cta: true,
    include_emojis: true,
    creativity_level: 7
  });
  
  // Generated Content
  const [generatedContent, setGeneratedContent] = useState<PlatformContent[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const generateContent = async () => {
    if (!originalContent.trim() || selectedPlatforms.length === 0) return;

    setIsGenerating(true);
    
    // Initialize content array
    const initialContent: PlatformContent[] = selectedPlatforms.map(platformId => ({
      platform: platformId,
      content: '',
      hashtags: [],
      character_count: 0,
      optimized_for: [],
      status: 'generating'
    }));
    
    setGeneratedContent(initialContent);

    try {
      for (const platformId of selectedPlatforms) {
        const platform = PLATFORMS.find(p => p.id === platformId);
        if (!platform) continue;

        const prompt = `
Create optimized ${platform.name} content based on these requirements:

Original Content: "${originalContent}"

Settings:
- Target Age: ${contentSettings.age_group}
- Content Type: ${contentSettings.content_type}
- Category: ${contentSettings.category}
- Tone: ${contentSettings.tone}
- Length: ${contentSettings.length}
- Include Hashtags: ${contentSettings.include_hashtags}
- Include Call-to-Action: ${contentSettings.include_cta}
- Include Emojis: ${contentSettings.include_emojis}
- Creativity Level: ${contentSettings.creativity_level}/10

Platform Specifications:
- Platform: ${platform.name}
- Character Limits: ${JSON.stringify(platform.limits)}
- Platform Features: ${platform.features.join(', ')}

Generate engaging, platform-optimized content that follows all requirements and character limits.
${contentSettings.include_hashtags ? 'Include relevant hashtags.' : ''}
${contentSettings.include_cta ? 'Include a compelling call-to-action.' : ''}
`;

        const response = await fetch('/api/v1/content/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt,
            platform: platformId,
            settings: contentSettings
          })
        });

        if (response.ok) {
          const result = await response.json();
          
          setGeneratedContent(prev => prev.map(item => 
            item.platform === platformId 
              ? {
                  ...item,
                  content: result.content || `Optimized ${platform.name} content based on your input would be generated here with AI. This is a demo showing the structure and features.`,
                  hashtags: result.hashtags || ['#story', '#content', '#social'],
                  character_count: result.content?.length || 120,
                  optimized_for: platform.features,
                  status: 'completed'
                }
              : item
          ));
        } else {
          throw new Error(`Failed to generate content for ${platform.name}`);
        }
      }
    } catch (error) {
      console.error('Content generation error:', error);
      
      // Fallback content for demo
      setGeneratedContent(prev => prev.map(item => {
        const platform = PLATFORMS.find(p => p.id === item.platform);
        return {
          ...item,
          content: `This is optimized ${platform?.name} content based on your settings:\n\nAge Group: ${contentSettings.age_group}\nType: ${contentSettings.content_type}\nCategory: ${contentSettings.category}\n\nYour original content: "${originalContent}"\n\n${contentSettings.include_cta ? 'Call-to-action would be included here!' : ''}`,
          hashtags: contentSettings.include_hashtags ? ['#storytelling', '#content', '#social', '#ai'] : [],
          character_count: 150,
          optimized_for: platform?.features || [],
          status: 'completed'
        };
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-2xl font-bold text-foreground">Loading Content Builder</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Advanced Content Builder</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push('/social-manager')}>
              Content Manager
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Input & Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Original Content Input */}
            <Card>
              <CardHeader>
                <CardTitle>Your Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="content">Original Story/Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter your story, idea, or content that you want to optimize for social media platforms..."
                    value={originalContent}
                    onChange={(e) => setOriginalContent(e.target.value)}
                    className="min-h-[120px] mt-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {originalContent.length} characters
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {PLATFORMS.map((platform) => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatforms.includes(platform.id);
                    
                    return (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full bg-gradient-to-r ${platform.color} text-white`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{platform.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {platform.features.slice(0, 2).join(', ')}
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Content Settings */}
            <Card>
              <CardHeader>
                <CardTitle>AI Generation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Age Group */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Target Age Group</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {AGE_GROUPS.map((age) => (
                      <button
                        key={age.id}
                        onClick={() => setContentSettings(prev => ({ ...prev, age_group: age.id as any }))}
                        className={`p-3 text-left rounded-lg border-2 transition-all ${
                          contentSettings.age_group === age.id 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-medium text-sm">{age.name}</div>
                        <div className="text-xs text-muted-foreground">{age.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Content Type */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Content Type</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {CONTENT_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setContentSettings(prev => ({ ...prev, content_type: type.id as any }))}
                          className={`p-3 text-left rounded-lg border-2 transition-all ${
                            contentSettings.content_type === type.id 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <div className="font-medium text-sm">{type.name}</div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{type.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Category */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Content Category</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setContentSettings(prev => ({ ...prev, category: category.id as any }))}
                        className={`p-3 text-left rounded-lg border-2 transition-all ${
                          contentSettings.category === category.id 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-medium text-sm">{category.name}</div>
                        <div className="text-xs text-muted-foreground">{category.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Advanced Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hashtags">Include Hashtags</Label>
                    <Switch
                      id="hashtags"
                      checked={contentSettings.include_hashtags}
                      onCheckedChange={(checked) => 
                        setContentSettings(prev => ({ ...prev, include_hashtags: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cta">Include Call-to-Action</Label>
                    <Switch
                      id="cta"
                      checked={contentSettings.include_cta}
                      onCheckedChange={(checked) => 
                        setContentSettings(prev => ({ ...prev, include_cta: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emojis">Include Emojis</Label>
                    <Switch
                      id="emojis"
                      checked={contentSettings.include_emojis}
                      onCheckedChange={(checked) => 
                        setContentSettings(prev => ({ ...prev, include_emojis: checked }))
                      }
                    />
                  </div>

                  <div>
                    <Label>Creativity Level: {contentSettings.creativity_level}/10</Label>
                    <Slider
                      value={[contentSettings.creativity_level]}
                      onValueChange={([value]) => 
                        setContentSettings(prev => ({ ...prev, creativity_level: value }))
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>

                <Button 
                  onClick={generateContent}
                  disabled={!originalContent.trim() || selectedPlatforms.length === 0 || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Platform Content
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Content Panel */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Platform-optimized content based on your settings
                </p>
              </CardHeader>
              <CardContent>
                {generatedContent.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
                    <p className="text-muted-foreground">
                      Enter your content, select platforms, and configure your settings to generate optimized social media content.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {generatedContent.map((item) => {
                      const platform = PLATFORMS.find(p => p.id === item.platform);
                      if (!platform) return null;
                      
                      const Icon = platform.icon;
                      
                      return (
                        <div key={item.platform} className="border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full bg-gradient-to-r ${platform.color} text-white`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{platform.name}</h3>
                                <div className="text-sm text-muted-foreground">
                                  {item.character_count} characters
                                  {item.status === 'generating' && ' • Generating...'}
                                </div>
                              </div>
                            </div>
                            
                            {item.status === 'completed' && (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyContent(item.content)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          {item.status === 'generating' ? (
                            <div className="flex items-center justify-center py-8">
                              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                              <span className="ml-2">Generating optimized content...</span>
                            </div>
                          ) : (
                            <>
                              <div className="bg-muted rounded-lg p-4 mb-4">
                                <div className="whitespace-pre-wrap text-sm">{item.content}</div>
                              </div>
                              
                              {item.hashtags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {item.hashtags.map((hashtag, index) => (
                                    <Badge key={index} variant="secondary">
                                      {hashtag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}