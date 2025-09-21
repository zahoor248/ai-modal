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
  Twitter,
  Facebook,
  MessageCircle,
  Copy,
  FileText,
  Heart,
  Star,
  Zap,
  Crown,
  Palette,
  Printer,
  Eye,
} from "lucide-react";
import { StoryEditor } from "@/components/story-editor";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useTypewriter } from "./TyprWriterEffect";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PDFBuilder } from "./ui/pdf-builder";

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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showPDFMenu, setShowPDFMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showPDFBuilder, setShowPDFBuilder] = useState(false);

  const [viewCount, setViewCount] = useState(
    Math.floor(Math.random() * 50) + 1
  );

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

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${currentStory.title}\n\n${currentStory.content}`
      );
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDownloadPDF = (template: string) => {
    // Enhanced PDF download with templates
    setShowPDFMenu(false);
    const element = document.createElement("a");
    const file = new Blob(
      [`${currentStory.title}\n\n${currentStory.content}`],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${currentStory.title
      .replace(/\s+/g, "-")
      .toLowerCase()}-${template}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSocialShare = (platform: string) => {
    const storyUrl = `${window.location.origin}/story/${currentStory.id}`;
    const text = `Check out this amazing story: "${currentStory.title}" 📚✨`;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(storyUrl)}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            storyUrl
          )}`
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${text} ${storyUrl}`)}`
        );
        break;
      case "copy":
        handleCopyToClipboard();
        break;
    }
    setShowShareMenu(false);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 animate-in fade-in duration-1000">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-in slide-in-from-top duration-500">
          <Button
            variant="ghost"
            onClick={onReset}
            className="hover:bg-primary/10 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Create Another Story
          </Button>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                <div className="absolute inset-0 animate-ping opacity-20">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Your Story
                </span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  <span>{viewCount} views</span>
                </div>
              </div>
            </div>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Story Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-card via-card/95 to-card/90 mb-8 animate-in slide-in-from-bottom duration-700">
            <CardHeader className="text-center pb-8 relative overflow-hidden">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full translate-y-12 -translate-x-12" />

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Badge
                    variant="secondary"
                    className="text-sm px-4 py-2 bg-primary/10 text-primary border-primary/20"
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    {currentStory?.template?.charAt(0)?.toUpperCase() +
                      currentStory?.template?.slice(1)}{" "}
                    Story
                  </Badge>
                  <Badge variant="outline" className="text-xs px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Premium Quality
                  </Badge>
                </div>
                <h1 className="story-title text-4xl md:text-6xl mb-6 font-serif leading-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-in slide-in-from-bottom duration-500">
                  {currentStory.title || "Your Story"}
                </h1>
                <div className="flex items-center justify-center gap-4 text-muted-foreground">
                  <p>
                    Created on{" "}
                    {new Date(currentStory?.createdAt).toLocaleDateString()}
                  </p>
                  <span>•</span>
                  <p className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {Math.floor(Math.random() * 20) + 5} likes
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="story-text max-w-3xl mx-auto prose prose-lg dark:prose-invert">
                {isGenerating ? (
                  <div className="space-y-4">
                    {currentStory.content ? (
                      <div className="relative">
                        <div className="animate-pulse opacity-80">
                          {/* {currentStory.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-4 last:mb-0 leading-relaxed">{paragraph}</p>
                          ))} */}

                          {currentStory.content}
                        </div>
                        <div className="flex items-center justify-center mt-6">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                          </div>
                          <span className="ml-3 text-sm text-muted-foreground">
                            Story in progress...
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="flex gap-1 mb-4">
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-3 h-3 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-3 h-3 bg-accent rounded-full animate-bounce"></div>
                        </div>
                        <p className="text-muted-foreground">
                          Crafting your story...
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentStory.content
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p
                          key={index}
                          className="mb-4 last:mb-0 leading-relaxed text-foreground/90"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Story Actions */}
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-card via-card/95 to-card/90 relative animate-in slide-in-from-bottom duration-1000">
            <CardContent className="p-8 relative">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-10 -translate-x-10" />
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-secondary/10 to-transparent rounded-full translate-y-8 translate-x-8" />

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-serif font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Share Your Creation
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Choose how you'd like to preserve and share this story
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {/* Listen Button */}
                  <Button
                    variant="outline"
                    onClick={handlePlay}
                    className="flex items-center gap-2 bg-transparent hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 animate-pulse" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Listen
                      </>
                    )}
                  </Button>

                  {/* Edit Button */}
                  <Button
                    variant="outline"
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-transparent hover:bg-secondary/10 hover:text-secondary transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/5 to-secondary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Button>

                  {/* Save Button */}
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={isSaved}
                    className="flex items-center gap-2 bg-transparent hover:bg-emerald-500/10 hover:text-emerald-600 transition-all duration-300 hover:scale-105 relative overflow-hidden group disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    {isSaved ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        Saved
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </Button>

                  {/* PDF Menu Button */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => setShowPDFMenu(!showPDFMenu)}
                      className="flex items-center gap-2 bg-transparent hover:bg-blue-500/10 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative overflow-hidden group w-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowPDFBuilder(!showPDFBuilder)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Customize PDF
                    </Button>
                    {/* PDF Menu */}
                    {showPDFMenu && (
                      <Card className="absolute top-full left-0 mt-2 w-64 z-50 shadow-2xl border bg-card animate-in fade-in slide-in-from-top-2 duration-300">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Choose PDF Template
                          </h4>
                          <div className="space-y-2">
                            {[
                              {
                                id: "classic",
                                name: "Classic",
                                desc: "Traditional book style",
                                icon: "📚",
                              },
                              {
                                id: "modern",
                                name: "Modern",
                                desc: "Clean contemporary",
                                icon: "✨",
                              },
                              {
                                id: "vintage",
                                name: "Vintage",
                                desc: "Aged parchment look",
                                icon: "📜",
                              },
                              {
                                id: "colorful",
                                name: "Colorful",
                                desc: "Vibrant illustrations",
                                icon: "🎨",
                              },
                            ].map((template) => (
                              <button
                                key={template.id}
                                onClick={() => handleDownloadPDF(template.id)}
                                className="w-full text-left p-2 rounded hover:bg-primary/10 transition-colors duration-200 flex items-center gap-3"
                              >
                                <span className="text-lg">{template.icon}</span>
                                <div>
                                  <p className="font-medium text-sm">
                                    {template.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {template.desc}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Share Menu Button */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="flex items-center gap-2 bg-transparent hover:bg-purple-500/10 hover:text-purple-600 transition-all duration-300 hover:scale-105 relative overflow-hidden group w-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>

                    {/* Share Menu */}
                    {showShareMenu && (
                      <Card className="absolute top-full right-0 mt-2 w-56 z-50 shadow-2xl border bg-card animate-in fade-in slide-in-from-top-2 duration-300">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            Share Your Story
                          </h4>
                          <div className="space-y-2">
                            {[
                              {
                                id: "twitter",
                                name: "Twitter/X",
                                icon: <Twitter className="w-4 h-4" />,
                                color: "text-sky-500",
                              },
                              {
                                id: "facebook",
                                name: "Facebook",
                                icon: <Facebook className="w-4 h-4" />,
                                color: "text-blue-600",
                              },
                              {
                                id: "whatsapp",
                                name: "WhatsApp",
                                icon: <MessageCircle className="w-4 h-4" />,
                                color: "text-green-500",
                              },
                              {
                                id: "copy",
                                name: copySuccess ? "Copied!" : "Copy Link",
                                icon: <Copy className="w-4 h-4" />,
                                color: copySuccess
                                  ? "text-green-500"
                                  : "text-gray-500",
                              },
                            ].map((platform) => (
                              <button
                                key={platform.id}
                                onClick={() => handleSocialShare(platform.id)}
                                className={`w-full text-left p-2 rounded hover:bg-primary/10 transition-colors duration-200 flex items-center gap-3 ${platform.color}`}
                              >
                                {platform.icon}
                                <span className="text-sm">{platform.name}</span>
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Publish Button */}
                  <Button
                    onClick={handlePublish}
                    disabled={isPublished}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isPublished ? (
                      <>
                        <Check className="w-4 h-4" />
                        Published
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4" />
                        Publish
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {showPDFBuilder && (
        <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50 p-6 overflow-auto">
          <div className="bg-card rounded-xl shadow-2xl w-full max-w-4xl p-6 relative">
            <button
              onClick={() => setShowPDFBuilder(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-red-500"
            >
              ✕
            </button>
            <PDFBuilder
              story={currentStory.content}
              title={currentStory.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}
