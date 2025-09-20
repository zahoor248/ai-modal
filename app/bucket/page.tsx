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
} from "lucide-react";
import { mockShelfStories } from "@/lib/mock-data";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ShelfPage() {
  const supabase = createClientComponentClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <h1 className="font-serif text-3xl font-bold">My Story Shelf</h1>
            </div>
          </div>
          <Link href="/generate">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Story
            </Button>
          </Link>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{stories.length} stories</span>
            <span>•</span>
            <span>
              {stories.reduce((acc, story) => acc + story.readTime, 0)} min
              total reading
            </span>
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
