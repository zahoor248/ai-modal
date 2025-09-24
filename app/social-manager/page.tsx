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
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Users, 
  Heart, 
  Share2, 
  Eye, 
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw,
  Settings
} from "lucide-react";
import Link from "next/link";

interface SocialPost {
  id: string;
  story_id: string;
  story_title: string;
  platforms: string[];
  content_type: string;
  caption: string;
  status: 'published' | 'scheduled' | 'draft' | 'failed';
  published_at: string | null;
  scheduled_at: string | null;
  stats: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
  created_at: string;
}

const PLATFORM_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: () => <div className="text-sm font-bold">TT</div>
};

const PLATFORM_COLORS = {
  instagram: 'from-pink-500 to-purple-600',
  facebook: 'from-blue-600 to-blue-700',
  twitter: 'from-sky-400 to-blue-500',
  youtube: 'from-red-500 to-red-600',
  tiktok: 'from-black to-gray-800'
};

export default function SocialManagerPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadSocialData();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = posts;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(post => post.status === filterStatus);
    }
    
    if (filterPlatform !== 'all') {
      filtered = filtered.filter(post => post.platforms.includes(filterPlatform));
    }
    
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.story_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.caption.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredPosts(filtered);
  }, [posts, filterStatus, filterPlatform, searchQuery]);

  const loadSocialData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Load social media posts
      const { data: postsData } = await supabase
        .from('social_media_posts')
        .select(`
          *,
          stories!inner(
            story_title
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (postsData) {
        const processedPosts = postsData.map((post: any) => ({
          ...post,
          story_title: post.stories?.story_title || 'Untitled Story',
          stats: post.stats || {
            views: Math.floor(Math.random() * 1000),
            likes: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 50),
            shares: Math.floor(Math.random() * 25)
          }
        }));
        setPosts(processedPosts);
      }
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'draft': return <Settings className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const calculateTotalStats = () => {
    return posts.reduce((total, post) => ({
      views: total.views + (post.stats.views || 0),
      likes: total.likes + (post.stats.likes || 0),
      comments: total.comments + (post.stats.comments || 0),
      shares: total.shares + (post.stats.shares || 0),
    }), { views: 0, likes: 0, comments: 0, shares: 0 });
  };

  const totalStats = calculateTotalStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-2xl font-bold text-foreground">Loading Social Manager</h2>
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
            <BarChart3 className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Social Media Manager</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={loadSocialData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => router.push('/social-builder')}>
              Create Content
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.views.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all platforms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.likes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Community engagement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.comments.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Active discussions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shares</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.shares.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Content virality</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search Content</Label>
                <Input
                  id="search"
                  placeholder="Search stories or captions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Status</Label>
                <select
                  className="w-full p-2 border border-border rounded-md bg-background"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div>
                <Label>Platform</Label>
                <select
                  className="w-full p-2 border border-border rounded-md bg-background"
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                >
                  <option value="all">All Platforms</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterPlatform('all');
                    setSearchQuery('');
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content List */}
        <Card>
          <CardHeader>
            <CardTitle>Published Content ({filteredPosts.length} posts)</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No content found</h3>
                <p className="text-muted-foreground mb-6">
                  {posts.length === 0 
                    ? "You haven't published any content yet." 
                    : "No content matches your current filters."
                  }
                </p>
                <Button onClick={() => router.push('/social-builder')}>
                  Create Your First Post
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{post.story_title}</h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {post.caption}
                        </p>
                        
                        {/* Platforms */}
                        <div className="flex items-center gap-2 mb-3">
                          {post.platforms.map((platform) => {
                            const Icon = PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS];
                            const colorClass = PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS];
                            return (
                              <div key={platform} className={`p-2 rounded-full bg-gradient-to-r ${colorClass} text-white`}>
                                {Icon && <Icon className="w-4 h-4" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={`${getStatusColor(post.status)} mb-2`}>
                          {getStatusIcon(post.status)}
                          <span className="ml-1 capitalize">{post.status}</span>
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {post.published_at ? (
                            `Published ${new Date(post.published_at).toLocaleDateString()}`
                          ) : post.scheduled_at ? (
                            `Scheduled for ${new Date(post.scheduled_at).toLocaleDateString()}`
                          ) : (
                            `Created ${new Date(post.created_at).toLocaleDateString()}`
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 text-center border-t pt-4">
                      <div>
                        <div className="text-lg font-semibold">{post.stats.views || 0}</div>
                        <div className="text-xs text-muted-foreground">Views</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{post.stats.likes || 0}</div>
                        <div className="text-xs text-muted-foreground">Likes</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{post.stats.comments || 0}</div>
                        <div className="text-xs text-muted-foreground">Comments</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{post.stats.shares || 0}</div>
                        <div className="text-xs text-muted-foreground">Shares</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}