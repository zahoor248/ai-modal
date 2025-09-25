"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Plus,
  TrendingUp,
  Eye,
  Heart,
  Award,
  Star,
  Sparkles,
  Calendar,
  Edit3,
  Loader2,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Users,
  MessageSquare,
  Video,
  Mail,
  Megaphone,
  Target,
  BarChart3,
  Settings,
  Crown,
  Zap,
  Mic,
  PenTool,
  ArrowRight,
  Clock,
  Activity,
  PlayCircle,
  FileText,
  Camera,
  Palette,
  Globe,
  Smartphone
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalStories: number;
  totalViews: number;
  totalLikes: number;
  weeklyCreated: number;
  socialPosts: number;
  contentGenerated: number;
}

interface ContentBuilder {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  features: string[];
  link: string;
  isNew?: boolean;
  isPro?: boolean;
  category: 'social' | 'story' | 'advanced' | 'analytics';
}

const CONTENT_BUILDERS: ContentBuilder[] = [
  // Social Media Builders
  {
    id: 'instagram',
    name: 'Instagram Builder',
    description: 'Stories, posts, reels, and carousel content with hashtag optimization',
    icon: Instagram,
    color: 'text-pink-600',
    gradient: 'from-pink-500 to-purple-600',
    features: ['Stories & Highlights', 'Reel Scripts', 'Hashtag Research', 'Visual Templates'],
    link: '/builders/instagram',
    category: 'social',
    isNew: true
  },
  {
    id: 'youtube',
    name: 'YouTube Builder',
    description: 'Video scripts, descriptions, thumbnails, and SEO optimization',
    icon: Youtube,
    color: 'text-red-600',
    gradient: 'from-red-500 to-red-600',
    features: ['Video Scripts', 'SEO Descriptions', 'Thumbnail Ideas', 'Chapter Timestamps'],
    link: '/builders/youtube',
    category: 'social'
  },
  {
    id: 'tiktok',
    name: 'TikTok/Reels Builder',
    description: 'Viral short-form content with trending hashtags and music suggestions',
    icon: Smartphone,
    color: 'text-black',
    gradient: 'from-black to-gray-800',
    features: ['Viral Scripts', 'Trending Hashtags', 'Music Sync', 'Hook Templates'],
    link: '/builders/tiktok',
    category: 'social',
    isNew: true
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Builder',
    description: 'Professional content, articles, and company updates for business growth',
    icon: Linkedin,
    color: 'text-blue-600',
    gradient: 'from-blue-600 to-blue-700',
    features: ['Professional Posts', 'Article Templates', 'Company Updates', 'Industry Insights'],
    link: '/builders/linkedin',
    category: 'social'
  },
  {
    id: 'twitter',
    name: 'Twitter/X Builder',
    description: 'Engaging threads, viral tweets, and trending content optimization',
    icon: Twitter,
    color: 'text-sky-500',
    gradient: 'from-sky-400 to-blue-500',
    features: ['Thread Builder', 'Viral Templates', 'Trend Analysis', 'Engagement Hooks'],
    link: '/builders/twitter',
    category: 'social'
  },
  {
    id: 'facebook',
    name: 'Facebook Builder',
    description: 'Community posts, events, and long-form content for engagement',
    icon: Facebook,
    color: 'text-blue-700',
    gradient: 'from-blue-600 to-blue-700',
    features: ['Community Posts', 'Event Content', 'Group Engagement', 'Story Templates'],
    link: '/builders/facebook',
    category: 'social'
  },
  {
    id: 'pinterest',
    name: 'Pinterest Builder',
    description: 'SEO-optimized pins, board descriptions, and visual content strategies',
    icon: Camera,
    color: 'text-red-500',
    gradient: 'from-red-400 to-pink-500',
    features: ['SEO Pins', 'Board Strategy', 'Visual Templates', 'Seasonal Content'],
    link: '/builders/pinterest',
    category: 'social'
  },
  
  // Advanced Builders
  {
    id: 'podcast',
    name: 'Podcast Builder',
    description: 'Show notes, episode descriptions, and social promotion content',
    icon: Mic,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-indigo-600',
    features: ['Show Notes', 'Episode Scripts', 'Social Promotion', 'Guest Prep'],
    link: '/builders/podcast',
    category: 'advanced',
    isPro: true
  },
  {
    id: 'email',
    name: 'Email Marketing Builder',
    description: 'Newsletter content, email sequences, and social media integration',
    icon: Mail,
    color: 'text-green-600',
    gradient: 'from-green-500 to-emerald-600',
    features: ['Newsletter Templates', 'Email Sequences', 'Social Integration', 'A/B Testing'],
    link: '/builders/email',
    category: 'advanced',
    isPro: true
  },
  {
    id: 'campaign',
    name: 'Brand Campaign Builder',
    description: 'Multi-platform campaign content with unified messaging and scheduling',
    icon: Megaphone,
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-red-500',
    features: ['Multi-Platform', 'Unified Messaging', 'Content Calendar', 'Brand Voice'],
    link: '/builders/campaign',
    category: 'advanced',
    isPro: true
  }
];

const ANALYTICS_TOOLS = [
  {
    id: 'social-manager',
    name: 'Social Media Manager',
    description: 'Track all your social content performance and engagement metrics',
    icon: BarChart3,
    link: '/social-manager'
  },
  {
    id: 'content-analytics',
    name: 'Content Analytics',
    description: 'Deep insights into your content performance across platforms',
    icon: Activity,
    link: '/analytics'
  }
];

const STORY_BUILDERS = [
  {
    id: 'story-wizard',
    name: 'Story Wizard',
    description: 'Advanced multi-step story creation with detailed customization',
    icon: BookOpen,
    link: '/generate'
  },
  {
    id: 'quick-builder',
    name: 'Quick Story Builder',
    description: 'Create stories in 2 simple steps - perfect for quick inspiration',
    icon: Zap,
    link: '/generate?mode=quick'
  },
];

export default function ModernDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStories: 0,
    totalViews: 0,
    totalLikes: 0,
    weeklyCreated: 0,
    socialPosts: 0,
    contentGenerated: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch comprehensive stats
        const [storiesResponse, socialResponse] = await Promise.all([
          supabase.from('stories').select('*').eq('user_id', user.id),
          supabase.from('social_media_posts').select('*').eq('user_id', user.id)
        ]);

        const stories = storiesResponse.data || [];
        const socialPosts = socialResponse.data || [];
        
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        setStats({
          totalStories: stories.length,
          totalViews: stories.reduce((sum: number, story: any) => sum + (story.views || 0), 0),
          totalLikes: stories.reduce((sum: number, story: any) => sum + (story.likes || 0), 0),
          weeklyCreated: stories.filter((story: any) => new Date(story.created_at) > oneWeekAgo).length,
          socialPosts: socialPosts.length,
          contentGenerated: stories.length + socialPosts.length
        });

      } catch (error) {
        console.error('Dashboard fetch error:', error);
        // Set fallback data
        setStats({
          totalStories: 0,
          totalViews: 0,
          totalLikes: 0,
          weeklyCreated: 0,
          socialPosts: 0,
          contentGenerated: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase, router]);

  const getFilteredBuilders = () => {
    if (activeTab === 'all') return CONTENT_BUILDERS;
    return CONTENT_BUILDERS.filter(builder => builder.category === activeTab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-2xl font-bold text-foreground">Loading Your Creative Hub</h2>
            <p className="text-muted-foreground">Preparing your content creation tools...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Enhanced Header */}
      <header className="border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  StoryBuds
                </span>
              </Link>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Pro Creator Hub
              </Badge>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-primary font-medium">
                Creator Hub
              </Link>
              <Link href="/analytics" className="text-muted-foreground hover:text-foreground transition-colors">
                Analytics
              </Link>
              <Link href="/social-manager" className="text-muted-foreground hover:text-foreground transition-colors">
                Content Manager
              </Link>
              <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
                Community
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <Link href="/profile-settings">
                <Button variant="ghost" size="sm" className="p-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Button>
              </Link>
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors" 
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Crown className="w-4 h-4" />
            Professional Content Creation Suite
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Creative <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Command Center</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access 10+ professional content builders, analytics tools, and social media management - all powered by advanced AI.
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalStories}</div>
              <p className="text-xs text-blue-700 dark:text-blue-300">Stories Created</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.socialPosts}</div>
              <p className="text-xs text-green-700 dark:text-green-300">Social Posts</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
            <CardContent className="p-4 text-center">
              <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-purple-700 dark:text-purple-300">Total Views</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200">
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-pink-900 dark:text-pink-100">{stats.totalLikes}</div>
              <p className="text-xs text-pink-700 dark:text-pink-300">Total Likes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.weeklyCreated}</div>
              <p className="text-xs text-orange-700 dark:text-orange-300">This Week</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{stats.contentGenerated}</div>
              <p className="text-xs text-indigo-700 dark:text-indigo-300">Total Content</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 hover:scale-105 transition-transform cursor-pointer">
            <Link href="/generate">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create New Story</h3>
                <p className="text-muted-foreground">Start with our AI-powered story wizard</p>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 hover:scale-105 transition-transform cursor-pointer">
            <Link href="/advanced-content-builder">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced Content Builder</h3>
                <p className="text-muted-foreground">Multi-platform content with AI optimization</p>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 hover:scale-105 transition-transform cursor-pointer">
            <Link href="/social-manager">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Social Manager</h3>
                <p className="text-muted-foreground">Track and manage all your content</p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Content Builders Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Professional Content Builders</h2>
              <p className="text-muted-foreground">Choose from 10+ specialized builders designed for different platforms and content types</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">All Builders</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Tools</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              {/* Social Media Builders */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Social Media Builders
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {CONTENT_BUILDERS.filter(builder => builder.category === 'social').map((builder) => {
                    const Icon = builder.icon;
                    return (
                      <Card key={builder.id} className="group hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-primary/50">
                        <Link href={builder.link}>
                          <CardContent className="p-6">
                            <div className="relative">
                              {builder.isNew && (
                                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">New</Badge>
                              )}
                              {builder.isPro && (
                                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white">Pro</Badge>
                              )}
                              
                              <div className={`w-16 h-16 bg-gradient-to-r ${builder.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon className="w-8 h-8 text-white" />
                              </div>
                              
                              <h4 className="text-lg font-semibold text-center mb-2">{builder.name}</h4>
                              <p className="text-sm text-muted-foreground text-center mb-4">{builder.description}</p>
                              
                              <div className="space-y-1">
                                {builder.features.slice(0, 3).map((feature, index) => (
                                  <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                    {feature}
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-4 flex items-center justify-center text-primary group-hover:translate-x-1 transition-transform">
                                <span className="text-sm font-medium mr-2">Build Content</span>
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Story Builders */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Story Builders
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {STORY_BUILDERS.map((builder) => {
                    const Icon = builder.icon;
                    return (
                      <Card key={builder.id} className="group hover:scale-105 transition-all duration-300 hover:shadow-xl">
                        <Link href={builder.link}>
                          <CardContent className="p-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-center mb-2">{builder.name}</h4>
                            <p className="text-sm text-muted-foreground text-center">{builder.description}</p>
                          </CardContent>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Tools */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Crown className="w-6 h-6 text-primary" />
                  Advanced Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CONTENT_BUILDERS.filter(builder => builder.category === 'advanced').map((builder) => {
                    const Icon = builder.icon;
                    return (
                      <Card key={builder.id} className="group hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-yellow-200">
                        <Link href={builder.link}>
                          <CardContent className="p-6">
                            <div className="relative">
                              <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white">Pro</Badge>
                              <div className={`w-16 h-16 bg-gradient-to-r ${builder.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon className="w-8 h-8 text-white" />
                              </div>
                              <h4 className="text-lg font-semibold text-center mb-2">{builder.name}</h4>
                              <p className="text-sm text-muted-foreground text-center mb-4">{builder.description}</p>
                              <div className="space-y-1">
                                {builder.features.map((feature, index) => (
                                  <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Analytics Tools */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  Analytics & Management
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ANALYTICS_TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Card key={tool.id} className="group hover:scale-105 transition-all duration-300 hover:shadow-xl">
                        <Link href={tool.link}>
                          <CardContent className="p-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-center mb-2">{tool.name}</h4>
                            <p className="text-sm text-muted-foreground text-center">{tool.description}</p>
                          </CardContent>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {CONTENT_BUILDERS.filter(builder => builder.category === 'social').map((builder) => {
                  const Icon = builder.icon;
                  return (
                    <Card key={builder.id} className="group hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-primary/50">
                      <Link href={builder.link}>
                        <CardContent className="p-6">
                          <div className="relative">
                            {builder.isNew && (
                              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">New</Badge>
                            )}
                            <div className={`w-16 h-16 bg-gradient-to-r ${builder.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-center mb-2">{builder.name}</h4>
                            <p className="text-sm text-muted-foreground text-center mb-4">{builder.description}</p>
                            <div className="space-y-1">
                              {builder.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="advanced">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CONTENT_BUILDERS.filter(builder => builder.category === 'advanced').map((builder) => {
                  const Icon = builder.icon;
                  return (
                    <Card key={builder.id} className="group hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-yellow-200">
                      <Link href={builder.link}>
                        <CardContent className="p-6">
                          <div className="relative">
                            <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white">Pro</Badge>
                            <div className={`w-16 h-16 bg-gradient-to-r ${builder.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-center mb-2">{builder.name}</h4>
                            <p className="text-sm text-muted-foreground text-center mb-4">{builder.description}</p>
                            <div className="space-y-1">
                              {builder.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ANALYTICS_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Card key={tool.id} className="group hover:scale-105 transition-all duration-300 hover:shadow-xl">
                      <Link href={tool.link}>
                        <CardContent className="p-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-center mb-2">{tool.name}</h4>
                          <p className="text-sm text-muted-foreground text-center">{tool.description}</p>
                        </CardContent>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer CTA */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to Create Professional Content?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of creators using our AI-powered tools to build engaging content across all platforms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/generate">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Creating Now
                  </Button>
                </Link>
                <Link href="/social-manager">
                  <Button variant="outline" size="lg">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}