"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Play,
  Pause,
  BookmarkPlus,
  Download,
  Share2,
  Globe,
  Check,
  Sparkles,
  Edit3,
} from "lucide-react";
import { StoryEditor } from "@/components/story-editor";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useTypewriter } from "./TyprWriterEffect";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Story {
  id: string;
  title: string;
  content: string;
  template: string;
  createdAt: string;
}

interface StoryDisplayProps {
  story: Story;
  onReset: () => void;
  isGenerating: boolean;
}

export function StoryDisplay({
  story,
  onReset,
  isGenerating,
}: StoryDisplayProps) {
  const supabase = createClientComponentClient();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStory, setCurrentStory] = useState(story);

  useEffect(() => {
    setCurrentStory(story);
  }, [story.content]);

  const handlePlay = () => {
    if (!isPlaying) {
      const utterance = new SpeechSynthesisUtterance(currentStory.content);
      utterance.lang = "en-US";
      utterance.rate = 1; // adjust speed
      utterance.pitch = 1; // adjust pitch
      utterance.onend = () => {
        setIsPlaying(false);
      };

      speechSynthesis.speak(utterance);
      console.log("hit");
      setIsPlaying(true);
    } else {
      speechSynthesis.cancel(); // stop playback
      setIsPlaying(false);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    // Mock save to shelf
  };

  const handleDownload = () => {
    // Mock PDF download
    const element = document.createElement("a");
    const file = new Blob(
      [`${currentStory.title}\n\n${currentStory.content}`],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${currentStory.title
      .replace(/\s+/g, "-")
      .toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    const shareData = {
      title: `"${currentStory.title}" - StoryBuds`,
      text: `Check out this amazing story: "${currentStory.title}" - ${currentStory.content.substring(0, 100)}...`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Enhanced fallback with multiple options
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
        // Could show a toast notification here
        alert('Story link copied to clipboard!');
      } catch (err) {
        // Fallback to fallback - create a shareable text
        const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Story details copied to clipboard!');
      }
    }
  };

  const handlePublish = () => {
    setIsPublished(true);
    // Mock publish to community
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async (updatedStory: {
    title: string;
    content: string;
  }) => {
    try {
      // Update local state first
      const newStory = {
        ...currentStory,
        title: updatedStory.title,
        content: updatedStory.content,
      };
      setCurrentStory(newStory);
      setIsEditing(false);

      // Save changes to Supabase
      const { error } = await supabase
        .from("stories") // table name
        .update({
          title: updatedStory.title,
          content: updatedStory.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentStory.id);

      if (error) {
        console.error("Error updating story:", error);
        alert("Failed to save changes. Please try again.");
      } else {
        console.log("Story updated successfully");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };
  // const typewriterText = useTypewriter(, 20);

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-end mb-4">
            <ThemeSwitcher />
          </div>
          <StoryEditor
            story={currentStory}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onReset}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Create Another Story
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-serif text-xl font-bold">Your Story</span>
            </div>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Story Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="card-shadow border-0 bg-card mb-8">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {currentStory?.template?.charAt(0)?.toUpperCase() +
                    currentStory?.template?.slice(1)}{" "}
                  Story
                </Badge>
              </div>
              <h1 className="story-title text-4xl md:text-5xl mb-4 font-serif leading-tight">
                {currentStory.title || "Your Story"}
              </h1>
              <p className="text-muted-foreground">
                Created on{" "}
                {new Date(currentStory?.createdAt).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="story-text max-w-3xl mx-auto prose prose-lg dark:prose-invert">
                {isGenerating ? (
                  <div className="space-y-4">
                    {currentStory.content ? (
                      <div className="relative">
                        <div className="animate-pulse opacity-80">
                          {currentStory.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-4 last:mb-0 leading-relaxed">{paragraph}</p>
                          ))}
                        </div>
                        <div className="flex items-center justify-center mt-6">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                          </div>
                          <span className="ml-3 text-sm text-muted-foreground">Story in progress...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="flex gap-1 mb-4">
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-3 h-3 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-3 h-3 bg-accent rounded-full animate-bounce"></div>
                        </div>
                        <p className="text-muted-foreground">Crafting your story...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentStory.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0 leading-relaxed text-foreground/90">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
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

                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Story
                </Button>

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
                  Download PDF
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-transparent hover:bg-primary/5"
                >
                  <Share2 className="w-4 h-4" />
                  Share Story
                </Button>

                <Button
                  onClick={handlePublish}
                  disabled={isPublished}
                  className="flex items-center gap-2"
                >
                  {isPublished ? (
                    <>
                      <Check className="w-4 h-4" />
                      Published
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      Publish to Community
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
