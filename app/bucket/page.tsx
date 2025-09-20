"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Search,
  Plus,
  Calendar,
  Heart,
  ArrowLeft,
  Sparkles,
  Filter,
  Grid3X3,
  List,
  Clock,
  Eye,
  Star,
  Crown,
  Palette,
  TrendingUp,
  Zap
} from "lucide-react";
import { mockShelfStories } from "@/lib/mock-data";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ShelfPage() {
  const supabase = createClientComponentClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'readTime'>('newest');
  const [filterTemplate, setFilterTemplate] = useState<string>('all');

  const filteredStories = stories.filter(
    (story) =>
      story.story_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.template.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false }); // newest first

      if (error) {
        console.error("Error fetching stories:", error);
      } else {
        const processedStories = data.map((story) => ({
          ...story,
          preview: story.content?.slice(0, 150) || "", // first 150 chars
          readTime: Math.max(
            1,
            Math.ceil((story.content?.split(" ").length || 0) / 200)
          ), // ~200 wpm
        }));
        console.log(processedStories, "test");
        setStories(processedStories || []);
      }
      setLoading(false);
    };

    fetchStories();
  }, []);
console.log(filteredStories)
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 animate-in fade-in duration-1000">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-primary/10 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="relative">
                <BookOpen className="w-8 h-8 text-primary animate-pulse" />
                <div className="absolute inset-0 animate-ping opacity-20">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="font-serif text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  My Story Shelf
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Your personal collection of stories
                </p>
              </div>
            </div>
          </div>
          <Link href="/generate">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Plus className="w-5 h-5 mr-2" />
              Create New Story
            </Button>
          </Link>
        </div>

        {/* Search, Filters, and Stats */}
        <div className="space-y-6 mb-10 animate-in slide-in-from-bottom duration-700">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search your magical story collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 focus:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md bg-card/50 backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                ×
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-lg p-4 text-center border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-bold text-primary mb-1">{stories.length}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <BookOpen className="w-3 h-3" />
                Stories Created
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-lg p-4 text-center border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-bold text-secondary mb-1">
                {stories.reduce((acc, story) => acc + (story.readTime || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                Minutes of Reading
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-lg p-4 text-center border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-bold text-accent mb-1">
                {new Set(stories.map(s => s.template)).size}
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Palette className="w-3 h-3" />
                Different Templates
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-lg p-4 text-center border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-bold text-emerald-500 mb-1">
                {stories.reduce((acc, story) => acc + (story.likes || Math.floor(Math.random() * 10)), 0)}
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Heart className="w-3 h-3" />
                Total Likes
              </div>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="transition-all duration-200"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="transition-all duration-200"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Showing {filteredStories.length} of {stories.length} stories
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <Link key={story.id} href={`/stories/${story.id}`}>
                <Card className="card-shadow border-0 bg-card hover:scale-105 transition-all duration-300 cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {story.template?.charAt(0).toUpperCase() +
                          story.template?.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(story.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="font-serif text-xl text-balance line-clamp-2">
                      {story.story_title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm text-pretty line-clamp-3 mb-4">
                      {story.preview}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3 h-3" />
                        <span>{story.readTime} min read</span>
                      </div>
                      {story.likes && (
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{story.likes}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-4">
                {searchQuery ? "No stories found" : "Your shelf is empty"}
              </h3>
              <p className="text-muted-foreground mb-6 text-pretty">
                {searchQuery
                  ? "Try adjusting your search terms to find the story you're looking for."
                  : "Start creating beautiful stories and they'll appear here for you to revisit anytime."}
              </p>
              {!searchQuery && (
                <Link href="/generate">
                  <Button size="lg">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Your First Story
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
