"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Play,
  Pause,
  BookmarkPlus,
  Download,
  Share2,
  Heart,
  Calendar,
  Clock,
  User,
  Check,
  Sparkles,
} from "lucide-react";

export default function StoryDetailPage() {
  const params = useParams();
  const [story, setStory] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(0);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchStory = async () => {
      if (!params.id) return;
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching story:", error);
      } else {
        setStory(data);
        setLikes(data.likes || 0);
        setIsSaved(data.isSaved || false);
      }
    };

    fetchStory();
  }, [params.id, supabase]);

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-semibold mb-4">
            Story not found
          </h2>
          <Link href="/bucket">
            <Button variant="outline">Back to Shelf</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 5000);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);

    // optional: update likes in Supabase
    supabase
      .from("stories")
      .update({ likes: isLiked ? likes - 1 : likes + 1 })
      .eq("id", params.id);
  };

  const handleSave = () => {
    setIsSaved(true);
    // optional: update isSaved in Supabase
    supabase.from("stories").update({ isSaved: true }).eq("id", params.id);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([`${story.title}\n\n${story.content}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${story.title.replace(/\s+/g, "-").toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: story.title,
        text: story.content.substring(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/bucket">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shelf
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-serif text-xl font-bold">Story</span>
          </div>
        </div>

        {/* Story Content */}
        <div className="max-w-4xl mx-auto">
          {/* Story Header */}
          <Card className="card-shadow border-0 bg-card mb-6">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {story.template?.charAt(0).toUpperCase() +
                    story.template?.slice(1)}{" "}
                  Story
                </Badge>
              </div>
              <h1 className="story-title text-4xl md:text-5xl mb-6">
                {story.title}
              </h1>

              {/* Story Meta */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(story.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {story.readTime ||
                    Math.ceil(
                      (story.content?.split(" ").length || 0) / 200
                    )}{" "}
                  min read
                </div>
                {story.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>by {story.author}</span>
                  </div>
                )}
              </div>

              {/* Author Info (optional) */}
              {story.author && story.authorAvatar && (
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={story.authorAvatar || "/placeholder.svg"}
                      alt={story.author}
                    />
                    <AvatarFallback>{story.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium">{story.author}</p>
                    <p className="text-xs text-muted-foreground">
                      Story Creator
                    </p>
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Story Text */}
          <Card className="card-shadow border-0 bg-card mb-6">
            <CardContent className="px-8 py-8">
              <div className="story-text max-w-3xl mx-auto">
                {story.content
                  ?.split("\n\n")
                  .map((paragraph: string, index: number) => (
                    <p key={index} className="mb-6 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Story Actions */}
          <Card className="card-shadow border-0 bg-card">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={handlePlay}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Listen
                    </>
                  )}
                </Button>

                {story.author && (
                  <Button
                    variant="outline"
                    onClick={handleLike}
                    className={`flex items-center gap-2 bg-transparent ${
                      isLiked ? "text-red-500 border-red-200" : ""
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                    />
                    {likes}
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={isSaved}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" />
                      Save to Shelf
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
