"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/components/theme-switcher";
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
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalStories: number;
  totalViews: number;
  totalLikes: number;
  weeklyCreated: number;
}

interface StoryMetric {
  id: string;
  title: string;
  views: number;
  likes: number;
  createdAt: string;
  template: string;
  readTime: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStories: 0,
    totalViews: 0,
    totalLikes: 0,
    weeklyCreated: 0,
  });

  const [recentStories, setRecentStories] = useState<StoryMetric[]>([]);
  const [topStories, setTopStories] = useState<StoryMetric[]>([]);
  const [editedStories, setEditedStories] = useState<StoryMetric[]>([]);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // redirect after logout
  };

  useEffect(() => {
    // Mock data - in real app this would come from API
    setStats({
      totalStories: 24,
      totalViews: 1247,
      totalLikes: 189,
      weeklyCreated: 3,
    });

    const mockRecentStories: StoryMetric[] = [
      {
        id: "1",
        title: "The Magical Forest Adventure",
        views: 45,
        likes: 12,
        createdAt: "2024-01-15",
        template: "kids",
        readTime: 3,
      },
      {
        id: "2",
        title: "Journey to the Crystal Caves",
        views: 32,
        likes: 8,
        createdAt: "2024-01-14",
        template: "adventure",
        readTime: 5,
      },
      {
        id: "3",
        title: "The Little Robot's Dream",
        views: 28,
        likes: 15,
        createdAt: "2024-01-13",
        template: "inspirational",
        readTime: 4,
      },
    ];

    const mockTopStories: StoryMetric[] = [
      {
        id: "4",
        title: "The Dragon and the Brave Knight",
        views: 156,
        likes: 34,
        createdAt: "2024-01-10",
        template: "kids",
        readTime: 6,
      },
      {
        id: "5",
        title: "Space Pirates of Andromeda",
        views: 142,
        likes: 29,
        createdAt: "2024-01-08",
        template: "adventure",
        readTime: 8,
      },
      {
        id: "6",
        title: "Finding Courage Within",
        views: 98,
        likes: 41,
        createdAt: "2024-01-05",
        template: "inspirational",
        readTime: 4,
      },
    ];

    const mockEditedStories: StoryMetric[] = [
      {
        id: "7",
        title: "The Enchanted Garden (Revised)",
        views: 67,
        likes: 18,
        createdAt: "2024-01-12",
        template: "kids",
        readTime: 3,
      },
      {
        id: "8",
        title: "Mystery of the Lost City (Updated)",
        views: 89,
        likes: 22,
        createdAt: "2024-01-11",
        template: "adventure",
        readTime: 7,
      },
    ];

    setRecentStories(mockRecentStories);
    setTopStories(mockTopStories);
    setEditedStories(mockEditedStories);
  }, []);

  const getTemplateColor = (template: string) => {
    switch (template) {
      case "kids":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "adventure":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "inspirational":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-serif text-xl font-bold text-foreground">
                  StoryWeaver
                </span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-primary font-medium">
                  Dashboard
                </Link>
                <Link
                  href="/generate"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Create
                </Link>
                <Link
                  href="/bucket"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Shelf
                </Link>
                <Link
                  href="/community"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Community
                </Link>
              </nav>
            </div>
            <ThemeSwitcher />
            <button className="text-neutral-700" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Storyteller!
          </h1>
          <p className="text-muted-foreground">
            Ready to create your next magical story?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Stories
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStories}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.weeklyCreated} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all stories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLikes}</div>
              <p className="text-xs text-muted-foreground">
                Community appreciation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Achievements
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Badges earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Create New Story CTA */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Ready to create something magical?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Let your imagination run wild with our AI-powered story
                  generator
                </p>
                <Link href="/generate">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Story
                  </Button>
                </Link>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Story Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recently Added */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recently Added
              </CardTitle>
              <CardDescription>Your latest story creations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentStories.map((story) => (
                <div
                  key={story.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <Link
                      href={`/stories/${story.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {story.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={getTemplateColor(story.template)}
                      >
                        {story.template}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {story.readTime} min read
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {story.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {story.likes}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recently Edited */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-primary" />
                Recently Edited
              </CardTitle>
              <CardDescription>Stories you've been refining</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editedStories.map((story) => (
                <div
                  key={story.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <Link
                      href={`/stories/${story.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {story.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={getTemplateColor(story.template)}
                      >
                        {story.template}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Edited {formatDate(story.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {story.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {story.likes}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Stories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Performing Stories
            </CardTitle>
            <CardDescription>
              Your most popular stories by views and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topStories.map((story, index) => (
                <div
                  key={story.id}
                  className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors relative"
                >
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                            ? "bg-gray-400 text-white"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>
                  )}
                  <Link
                    href={`/stories/${story.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors block mb-2"
                  >
                    {story.title}
                  </Link>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant="secondary"
                      className={getTemplateColor(story.template)}
                    >
                      {story.template}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {story.readTime} min read
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {story.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {story.likes} likes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Awards & Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Awards & Achievements
            </CardTitle>
            <CardDescription>
              Your storytelling milestones and badges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">First Story</h4>
                  <p className="text-xs text-muted-foreground">
                    Created your first story
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    Community Favorite
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Received 100+ likes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-800">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    Trending Author
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Story reached trending
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
