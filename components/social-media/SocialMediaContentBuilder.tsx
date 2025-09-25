"use client";

import { useState, useEffect } from "react";
import { 
  Video, 
  Image as ImageIcon, 
  Type, 
  Calendar, 
  Send, 
  Save, 
  Eye,
  Hash,
  Users,
  Clock,
  TrendingUp,
  Palette,
  Wand2,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import AIContentGenerator from "@/components/AIContentGenerator";

// Platform configurations
const PLATFORMS = {
  tiktok: {
    name: "TikTok",
    color: "#ff0050",
    icon: "🎵",
    maxLength: 2200,
    aspectRatio: "9:16",
    maxDuration: 180,
    features: ["video", "music", "effects", "hashtags"]
  },
  youtube: {
    name: "YouTube",
    color: "#ff0000", 
    icon: "📺",
    maxLength: 5000,
    aspectRatio: "16:9",
    maxDuration: 3600,
    features: ["video", "thumbnail", "chapters", "description"]
  },
  instagram: {
    name: "Instagram",
    color: "#e4405f",
    icon: "📷",
    maxLength: 2200,
    aspectRatio: "1:1",
    maxDuration: 90,
    features: ["image", "video", "stories", "reels", "hashtags"]
  },
  facebook: {
    name: "Facebook", 
    color: "#1877f2",
    icon: "👥",
    maxLength: 63206,
    aspectRatio: "16:9",
    maxDuration: 240,
    features: ["image", "video", "text", "events"]
  }
};

const CONTENT_TEMPLATES = {
  story_promotion: {
    name: "Story Promotion",
    description: "Promote your latest story",
    template: "🌟 New story alert! 📚\n\nJust published: \"{title}\"\n\n{description}\n\nWhat's your favorite part? Let me know in the comments! 👇\n\n{hashtags}"
  },
  behind_scenes: {
    name: "Behind the Scenes",
    description: "Share your writing process",
    template: "✍️ Behind the scenes of writing \"{title}\"\n\n{process_description}\n\nWriting tip: {tip}\n\n{hashtags}"
  },
  quote_highlight: {
    name: "Quote Highlight", 
    description: "Share an inspiring quote from your story",
    template: "💭 \"{quote}\"\n\nFrom my latest story: \"{title}\"\n\n{context}\n\n{hashtags}"
  },
  reading_community: {
    name: "Community Engagement",
    description: "Engage with your reading community",
    template: "📖 What are you reading today?\n\nI just finished working on \"{title}\" and I'm curious about your current reads!\n\nShare in the comments 👇\n\n{hashtags}"
  }
};

const HASHTAG_SUGGESTIONS = {
  general: ["#storytelling", "#writer", "#reading", "#books", "#fiction"],
  genre: {
    adventure: ["#adventure", "#action", "#thriller"],
    romance: ["#romance", "#love", "#relationships"],
    fantasy: ["#fantasy", "#magic", "#worldbuilding"],
    mystery: ["#mystery", "#suspense", "#detective"],
    scifi: ["#scifi", "#futuristic", "#technology"]
  },
  audience: ["#booklovers", "#readers", "#writingcommunity", "#booktok", "#bookstagram"]
};

interface SocialMediaContentBuilderProps {
  story?: {
    id: string;
    title: string;
    content: string;
    type: string;
  };
  onSave?: (content: any) => void;
  onPublish?: (content: any, platforms: string[]) => void;
}

export function SocialMediaContentBuilder({
  story,
  onSave,
  onPublish
}: SocialMediaContentBuilderProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
  const [contentType, setContentType] = useState<"image" | "video" | "text">("image");
  const [template, setTemplate] = useState("story_promotion");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (story && template) {
      generateCaption();
    }
  }, [story, template]);

  const generateCaption = async () => {
    if (!story) return;
    
    setIsGenerating(true);
    try {
      const templateData = CONTENT_TEMPLATES[template as keyof typeof CONTENT_TEMPLATES];
      let generatedCaption = templateData.template;
      
      // Replace template variables
      generatedCaption = generatedCaption
        .replace(/\{title\}/g, story.title)
        .replace(/\{description\}/g, story.content.slice(0, 100) + "...")
        .replace(/\{hashtags\}/g, hashtags.join(" "))
        .replace(/\{quote\}/g, extractQuote(story.content))
        .replace(/\{process_description\}/g, "The inspiration came from...")
        .replace(/\{tip\}/g, "Start with character development!")
        .replace(/\{context\}/g, "This moment captures the essence of the story");

      setCaption(generatedCaption);
      
      // Auto-generate hashtags
      const autoHashtags = [...HASHTAG_SUGGESTIONS.general];
      if (story.type && HASHTAG_SUGGESTIONS.genre[story.type as keyof typeof HASHTAG_SUGGESTIONS.genre]) {
        autoHashtags.push(...HASHTAG_SUGGESTIONS.genre[story.type as keyof typeof HASHTAG_SUGGESTIONS.genre]);
      }
      autoHashtags.push(...HASHTAG_SUGGESTIONS.audience.slice(0, 3));
      
      setHashtags(autoHashtags.slice(0, 10));
    } catch (error) {
      console.error("Error generating caption:", error);
      toast.error("Failed to generate caption");
    } finally {
      setIsGenerating(false);
    }
  };

  const extractQuote = (content: string): string => {
    const sentences = content.split(/[.!?]+/);
    const meaningfulSentences = sentences.filter(s => s.trim().length > 20);
    return meaningfulSentences[0]?.trim() || "A powerful moment from the story";
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const addHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags(prev => [...prev, tag]);
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(prev => prev.filter(t => t !== tag));
  };

  const getCharacterCount = () => {
    const fullText = `${caption}\n\n${hashtags.join(" ")}`;
    return fullText.length;
  };

  const getMaxLength = () => {
    if (selectedPlatforms.length === 0) return 2200;
    return Math.min(...selectedPlatforms.map(p => PLATFORMS[p as keyof typeof PLATFORMS].maxLength));
  };

  const handleSave = () => {
    const content = {
      platforms: selectedPlatforms,
      contentType,
      caption,
      hashtags,
      mediaFiles: mediaFiles.map(f => f.name),
      scheduledDate,
      storyId: story?.id
    };
    
    onSave?.(content);
    toast.success("Content saved as draft");
  };

  const handlePublish = () => {
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    const content = {
      platforms: selectedPlatforms,
      contentType,
      caption,
      hashtags,
      mediaFiles,
      scheduledDate,
      storyId: story?.id
    };

    onPublish?.(content, selectedPlatforms);
    
    if (scheduledDate) {
      toast.success(`Content scheduled for ${new Date(scheduledDate).toLocaleDateString()}`);
    } else {
      toast.success("Content published successfully!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Content Builder</h2>
          <p className="text-muted-foreground">Create engaging content for your stories</p>
        </div>
        {story && (
          <Badge variant="outline" className="text-sm">
            📚 {story.title}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Content Creation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Target Platforms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(PLATFORMS).map(([key, platform]) => (
                  <div
                    key={key}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPlatforms.includes(key)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => togglePlatform(key)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{platform.icon}</span>
                      <div>
                        <div className="font-medium">{platform.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {platform.maxLength.toLocaleString()} chars max
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wand2 className="w-5 h-5" />
                <span>Content Template</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Template Type</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CONTENT_TEMPLATES).map(([key, tmpl]) => (
                      <SelectItem key={key} value={key}>
                        <div>
                          <div className="font-medium">{tmpl.name}</div>
                          <div className="text-xs text-muted-foreground">{tmpl.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Content Type</Label>
                <div className="flex space-x-2 mt-1">
                  {[
                    { icon: ImageIcon, value: "image", label: "Image" },
                    { icon: Video, value: "video", label: "Video" },
                    { icon: Type, value: "text", label: "Text" }
                  ].map(({ icon: Icon, value, label }) => (
                    <Button
                      key={value}
                      variant={contentType === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setContentType(value as any)}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={generateCaption} 
                disabled={isGenerating || !story}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Content"}
              </Button>
            </CardContent>
          </Card>

          {/* Caption Editor with AI Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Type className="w-5 h-5" />
                  <span>Caption & AI Generator</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {getCharacterCount()}/{getMaxLength()}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="ai">🤖 AI Generator</TabsTrigger>
                </TabsList>
                
                <TabsContent value="manual" className="space-y-4">
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write your caption here..."
                    className="min-h-[150px] resize-none"
                    maxLength={getMaxLength()}
                  />
                  {getCharacterCount() > getMaxLength() && (
                    <p className="text-sm text-destructive mt-2">
                      Caption exceeds maximum length for selected platforms
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="ai">
                  <AIContentGenerator
                    onContentGenerated={(content) => setCaption(content)}
                    onHashtagsGenerated={(tags) => setHashtags(tags)}
                    platform={selectedPlatforms[0] || 'instagram'}
                    contentType="caption"
                    placeholder={`Create engaging content for ${selectedPlatforms.map(p => PLATFORMS[p as keyof typeof PLATFORMS]?.name || p).join(', ')}...`}
                    maxLength={getMaxLength()}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Hashtags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="w-5 h-5" />
                <span>Hashtags</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeHashtag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>

              <div>
                <Label className="text-sm font-medium">Suggested Hashtags</Label>
                <div className="mt-2 space-y-2">
                  {Object.entries(HASHTAG_SUGGESTIONS).map(([category, tags]) => (
                    <div key={category}>
                      <div className="text-xs font-medium text-muted-foreground capitalize mb-1">
                        {category}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(tags) ? tags : []).slice(0, 5).map((tag) => (
                          <Button
                            key={tag}
                            variant="outline"
                            size="sm"
                            onClick={() => addHashtag(tag)}
                            className="text-xs h-6 px-2"
                            disabled={hashtags.includes(tag)}
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span>Media</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <div className="space-y-2">
                  <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    Drag and drop your images or videos here
                  </div>
                  <Button variant="outline" size="sm">
                    Choose Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Preview & Publishing */}
        <div className="space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    U
                  </div>
                  <div>
                    <div className="font-medium text-sm">Your Name</div>
                    <div className="text-xs text-muted-foreground">@username</div>
                  </div>
                </div>
                
                {contentType !== "text" && (
                  <div className="bg-border rounded aspect-square flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                
                <div className="text-sm whitespace-pre-wrap">
                  {caption}
                  {hashtags.length > 0 && (
                    <div className="mt-2 text-primary">
                      {hashtags.join(" ")}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Scheduling</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Schedule for later</Label>
                <Switch 
                  checked={!!scheduledDate}
                  onCheckedChange={(checked) => {
                    if (!checked) setScheduledDate("");
                  }}
                />
              </div>
              
              {scheduledDate !== "" && (
                <div>
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="mt-1"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={handleSave} variant="outline" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            <Button 
              onClick={handlePublish} 
              className="w-full"
              disabled={!caption.trim() || selectedPlatforms.length === 0}
            >
              {scheduledDate ? (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Post
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Publish Now
                </>
              )}
            </Button>
          </div>

          {/* Platform Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Platform Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {selectedPlatforms.map(platform => {
                  const config = PLATFORMS[platform as keyof typeof PLATFORMS];
                  return (
                    <div key={platform} className="flex justify-between">
                      <span>{config.name}</span>
                      <span className="text-muted-foreground">
                        {config.aspectRatio}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}