"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  RefreshCw, 
  Copy, 
  Check,
  AlertCircle,
  Zap,
  MessageSquare,
  Hash,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AIContentGeneratorProps {
  onContentGenerated: (content: string) => void;
  onHashtagsGenerated: (hashtags: string[]) => void;
  platform?: string;
  contentType?: 'story' | 'caption' | 'hashtags' | 'description';
  placeholder?: string;
  maxLength?: number;
}

export default function AIContentGenerator({
  onContentGenerated,
  onHashtagsGenerated,
  platform = 'instagram',
  contentType = 'caption',
  placeholder = "Describe what you want to create...",
  maxLength = 2200
}: AIContentGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [generationMode, setGenerationMode] = useState<'full' | 'stream'>('full');

  const generateContent = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate content');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedContent('');

    try {
      const enhancedPrompt = createEnhancedPrompt(prompt, platform, contentType, maxLength);
      
      if (generationMode === 'stream') {
        await generateWithStreaming(enhancedPrompt);
      } else {
        await generateWithFullResponse(enhancedPrompt);
      }
    } catch (err: any) {
      console.error('AI generation error:', err);
      setError(err.message || 'Failed to generate content. Please try again.');
      toast.error('Content generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateWithFullResponse = async (enhancedPrompt: string) => {
    const response = await fetch('/api/v1/story/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        fullPrompt: enhancedPrompt, 
        mode: 'full' 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }

    const data = await response.json();
    const content = data.story?.trim() || '';
    
    if (!content) {
      throw new Error('Generated content is empty');
    }

    setGeneratedContent(content);
    onContentGenerated(content);
    
    // Auto-generate hashtags if content type supports it
    if (contentType === 'caption' || contentType === 'story') {
      const hashtags = extractHashtags(content, platform);
      if (hashtags.length > 0) {
        onHashtagsGenerated(hashtags);
      }
    }

    toast.success('Content generated successfully!');
  };

  const generateWithStreaming = async (enhancedPrompt: string) => {
    const response = await fetch('/api/v1/story/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        fullPrompt: enhancedPrompt, 
        mode: 'stream' 
      }),
    });

    if (!response.ok) {
      throw new Error('Streaming request failed');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response stream available');
    }

    const decoder = new TextDecoder();
    let accumulatedContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      accumulatedContent += chunk;
      setGeneratedContent(accumulatedContent);
    }

    onContentGenerated(accumulatedContent);
    toast.success('Content generated successfully!');
  };

  const createEnhancedPrompt = (userPrompt: string, platform: string, type: string, maxLen: number): string => {
    const platformContext = getPlatformContext(platform);
    const typeContext = getContentTypeContext(type);
    
    return `${typeContext}

Platform: ${platformContext}
Maximum length: ${maxLen} characters
User request: ${userPrompt}

Generate engaging, platform-optimized content that:
- Matches the platform's tone and style
- Stays within the character limit
- Includes relevant emojis and formatting
- Is optimized for engagement
- Follows current social media best practices

Content:`;
  };

  const getPlatformContext = (platform: string): string => {
    const contexts = {
      instagram: 'Instagram - Visual-first platform. Use emojis, hashtags, engaging captions that encourage interaction.',
      tiktok: 'TikTok - Short-form video platform. Use trendy language, hooks, calls-to-action, viral elements.',
      youtube: 'YouTube - Long-form content platform. Use descriptive, searchable language with strong hooks.',
      twitter: 'Twitter/X - Concise, punchy content. Use threads, mentions, trending topics.',
      linkedin: 'LinkedIn - Professional network. Use business-appropriate tone, industry insights, value-driven content.',
      facebook: 'Facebook - Community-focused platform. Use storytelling, personal connections, shareable content.',
      pinterest: 'Pinterest - Discovery platform. Use descriptive, searchable content with clear value proposition.'
    };
    return contexts[platform as keyof typeof contexts] || contexts.instagram;
  };

  const getContentTypeContext = (type: string): string => {
    const contexts = {
      story: 'Create a compelling narrative story with beginning, middle, and end.',
      caption: 'Write an engaging social media caption that captures attention and encourages interaction.',
      hashtags: 'Generate relevant, trending hashtags for maximum discoverability.',
      description: 'Create a detailed, informative description that provides value to the audience.'
    };
    return contexts[type as keyof typeof contexts] || contexts.caption;
  };

  const extractHashtags = (content: string, platform: string): string[] => {
    const platformHashtags = {
      instagram: ['#instadaily', '#photooftheday', '#instagood', '#love', '#beautiful'],
      tiktok: ['#fyp', '#viral', '#trending', '#foryou', '#discover'],
      youtube: ['#youtube', '#subscribe', '#like', '#share', '#comment'],
      twitter: ['#TwitterChat', '#trending', '#news', '#update', '#viral'],
      linkedin: ['#LinkedIn', '#professional', '#career', '#business', '#networking'],
      facebook: ['#facebook', '#friends', '#family', '#community', '#share'],
      pinterest: ['#pinterest', '#inspiration', '#ideas', '#discover', '#save']
    };

    // Extract existing hashtags from content
    const existingHashtags = content.match(/#\w+/g) || [];
    
    // Add platform-specific hashtags
    const platformSpecific = platformHashtags[platform as keyof typeof platformHashtags] || platformHashtags.instagram;
    
    // Combine and deduplicate
    const allHashtags = [...new Set([...existingHashtags, ...platformSpecific.slice(0, 5)])];
    
    return allHashtags.slice(0, 10); // Limit to 10 hashtags
  };

  const copyToClipboard = async () => {
    if (!generatedContent) return;
    
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      toast.success('Content copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy content');
    }
  };

  const regenerateContent = () => {
    if (prompt.trim()) {
      generateContent();
    }
  };

  const getContentTypeIcon = () => {
    switch (contentType) {
      case 'story': return <MessageSquare className="w-4 h-4" />;
      case 'hashtags': return <Hash className="w-4 h-4" />;
      case 'description': return <ImageIcon className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {getContentTypeIcon()}
          AI Content Generator
          <Badge variant="secondary" className="ml-auto">
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            What would you like to create?
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{prompt.length}/500 characters</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGenerationMode(generationMode === 'full' ? 'stream' : 'full')}
                className="h-6 px-2 text-xs"
              >
                {generationMode === 'stream' ? <Zap className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                {generationMode === 'stream' ? 'Streaming' : 'Full'}
              </Button>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateContent}
          disabled={!prompt.trim() || isGenerating}
          className="w-full"
          size="lg"
        >
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Wand2 className="w-4 h-4" />
                </motion.div>
                Generating {contentType}...
              </motion.div>
            ) : (
              <motion.div
                key="generate"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Generate {contentType}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generated Content */}
        <AnimatePresence>
          {generatedContent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Generated Content</label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={regenerateContent}
                    className="h-7 px-2 text-xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-7 px-2 text-xs"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <Textarea
                  value={generatedContent}
                  onChange={(e) => {
                    setGeneratedContent(e.target.value);
                    onContentGenerated(e.target.value);
                  }}
                  className="min-h-[120px] resize-none pr-16"
                  maxLength={maxLength}
                />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {generatedContent.length}/{maxLength}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => onContentGenerated(generatedContent)}
                  size="sm"
                  className="flex-1"
                >
                  Use This Content
                </Button>
                <Button
                  variant="outline"
                  onClick={regenerateContent}
                  size="sm"
                  className="flex-1"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}