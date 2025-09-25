"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/lib/toast';
import PostSimulator from './PostSimulator';

interface AIContentBuilderProps {
  platform: string;
  platformData: {
    name: string;
    icon: string;
    color: string;
    description: string;
    features: string[];
  };
}

interface ContentForm {
  type: string;
  topic: string;
  audience: string;
  tone: string;
  length: string;
  includeHashtags: boolean;
  includeEmojis: boolean;
  trends: string[];
}

const contentTypes: Record<string, string[]> = {
  tiktok: ['video', 'challenge', 'dance', 'comedy', 'educational'],
  youtube: ['video', 'tutorial', 'review', 'vlog', 'shorts'],
  instagram: ['post', 'story', 'reel', 'carousel', 'igtv'],
  twitter: ['tweet', 'thread', 'poll', 'quote', 'reply'],
  linkedin: ['post', 'article', 'poll', 'carousel', 'story'],
  pinterest: ['pin', 'story', 'idea', 'board', 'collection']
};

const tones = ['professional', 'casual', 'funny', 'inspiring', 'educational', 'trendy', 'authentic'];
const audiences = ['teens', 'young adults', 'professionals', 'parents', 'entrepreneurs', 'creators', 'general'];
const lengths = ['short', 'medium', 'long'];

export default function AIContentBuilder({ platform, platformData }: AIContentBuilderProps) {
  const [formData, setFormData] = useState<ContentForm>({
    type: contentTypes[platform]?.[0] || 'post',
    topic: '',
    audience: 'general',
    tone: 'casual',
    length: 'medium',
    includeHashtags: true,
    includeEmojis: true,
    trends: []
  });
  
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [step, setStep] = useState<'form' | 'generating' | 'result'>('form');
  const { notify } = useToast();

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      notify('Please enter a topic for your content', 'error');
      return;
    }

    setStep('generating');
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/v1/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          ...formData
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      
      const data = await response.json();
      setGeneratedContent(data.content);
      setStep('result');
      notify('Content generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating content:', error);
      notify('Failed to generate content. Please try again.', 'error');
      setStep('form');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSchedule = async () => {
    if (!generatedContent) return;
    
    try {
      const scheduleTime = new Date();
      scheduleTime.setHours(scheduleTime.getHours() + 1); // Schedule 1 hour from now
      
      const response = await fetch('/api/v1/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: [platform],
          content: {
            text: generatedContent.caption || generatedContent.post || generatedContent.tweet || generatedContent.pinTitle,
            hashtags: generatedContent.hashtags || [],
            type: formData.type
          },
          scheduleTime: scheduleTime.toISOString(),
          timezone: 'America/New_York'
        })
      });
      
      if (response.ok) {
        notify('Content scheduled successfully!', 'success');
      } else {
        throw new Error('Failed to schedule');
      }
    } catch (error) {
      notify('Failed to schedule content', 'error');
    }
  };

  const loadTrends = async () => {
    try {
      const response = await fetch(`/api/v1/trends?platform=${platform}&type=hashtags`);
      const data = await response.json();
      const topics = data.trends?.map((trend: any) => trend.tag || trend.value).slice(0, 10) || [];
      setTrendingTopics(topics);
    } catch (error) {
      console.error('Error loading trends:', error);
    }
  };

  const addTrendToForm = (trend: string) => {
    if (!formData.trends.includes(trend)) {
      setFormData(prev => ({
        ...prev,
        trends: [...prev.trends, trend]
      }));
    }
  };

  const removeTrendFromForm = (trend: string) => {
    setFormData(prev => ({
      ...prev,
      trends: prev.trends.filter(t => t !== trend)
    }));
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border/50 rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platformData.color} flex items-center justify-center text-2xl`}>
                {platformData.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI {platformData.name} Content Generator</h2>
                <p className="text-foreground/60">{platformData.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Content Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {contentTypes[platform]?.map(type => (
                      <option key={type} value={type} className="capitalize">{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Topic/Idea</label>
                  <textarea
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder={`What do you want to create for ${platformData.name}?`}
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <select
                      value={formData.audience}
                      onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
                      className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {audiences.map(audience => (
                        <option key={audience} value={audience} className="capitalize">{audience}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tone</label>
                    <select
                      value={formData.tone}
                      onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                      className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {tones.map(tone => (
                        <option key={tone} value={tone} className="capitalize">{tone}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content Length</label>
                  <div className="flex gap-3">
                    {lengths.map(length => (
                      <button
                        key={length}
                        onClick={() => setFormData(prev => ({ ...prev, length }))}
                        className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          formData.length === length
                            ? `bg-gradient-to-r ${platformData.color} text-white shadow-lg`
                            : 'bg-background border border-border hover:bg-accent'
                        }`}
                      >
                        {length.charAt(0).toUpperCase() + length.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.includeHashtags}
                      onChange={(e) => setFormData(prev => ({ ...prev, includeHashtags: e.target.checked }))}
                      className="w-4 h-4 text-primary bg-background border border-border rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm">Include Hashtags</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.includeEmojis}
                      onChange={(e) => setFormData(prev => ({ ...prev, includeEmojis: e.target.checked }))}
                      className="w-4 h-4 text-primary bg-background border border-border rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm">Include Emojis</span>
                  </label>
                </div>
              </div>

              {/* Trending Topics Sidebar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Trending Now</h3>
                  <button
                    onClick={loadTrends}
                    className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    Refresh Trends
                  </button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {trendingTopics.map((trend, index) => (
                    <motion.button
                      key={trend}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => addTrendToForm(trend)}
                      className="w-full text-left p-3 bg-background border border-border rounded-lg hover:bg-accent transition-all duration-200 text-sm"
                    >
                      {trend}
                    </motion.button>
                  ))}
                </div>

                {formData.trends.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Selected Trends</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.trends.map(trend => (
                        <span
                          key={trend}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                        >
                          {trend}
                          <button
                            onClick={() => removeTrendFromForm(trend)}
                            className="hover:text-primary/70"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleGenerate}
                className={`px-8 py-4 bg-gradient-to-r ${platformData.color} text-white rounded-full font-semibold hover:scale-105 transition-all duration-200 shadow-lg text-lg`}
              >
                Generate {platformData.name} Content
              </button>
            </div>
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-card border border-border/50 rounded-2xl p-16 text-center"
          >
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${platformData.color} flex items-center justify-center text-4xl mx-auto mb-8 animate-pulse`}>
              {platformData.icon}
            </div>
            <h2 className="text-2xl font-bold mb-4">Creating Your Content...</h2>
            <p className="text-foreground/60 mb-8">Our AI is analyzing trends and generating optimized content for {platformData.name}</p>
            <div className="flex items-center justify-center">
              <div className={`w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin bg-gradient-to-r ${platformData.color} bg-clip-text text-transparent`}></div>
            </div>
          </motion.div>
        )}

        {step === 'result' && generatedContent && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Generated Content</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('form')}
                    className="px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors duration-200"
                  >
                    Edit Parameters
                  </button>
                  <button
                    onClick={handleSchedule}
                    className={`px-6 py-2 bg-gradient-to-r ${platformData.color} text-white rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg`}
                  >
                    Schedule Post
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Content Preview */}
                <div className="space-y-4 lg:col-span-2">
                  {generatedContent.caption && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Caption</h3>
                      <div className="p-4 bg-background border border-border rounded-lg">
                        <p className="whitespace-pre-wrap">{generatedContent.caption}</p>
                      </div>
                    </div>
                  )}

                  {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Hashtags</h3>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.hashtags.map((tag: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {generatedContent.videoScript && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Video Script</h3>
                      <div className="p-4 bg-background border border-border rounded-lg space-y-2">
                        {generatedContent.videoScript.map((line: string, index: number) => (
                          <p key={index} className="text-sm">{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Post Simulator */}
                <div className="lg:col-span-1">
                  <PostSimulator 
                    platform={platform} 
                    content={generatedContent} 
                    platformData={platformData} 
                  />
                </div>
              </div>
              
              {/* Platform-specific features */}
              <div className="mt-8 space-y-4">
                {generatedContent.soundSuggestions && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Sound Suggestions</h3>
                    <div className="space-y-2">
                      {generatedContent.soundSuggestions.map((sound: any, index: number) => (
                        <div key={index} className="p-3 bg-background border border-border rounded-lg">
                          <div className="font-medium">{sound.name}</div>
                          <div className="text-sm text-foreground/60">{sound.artist} • {sound.duration}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {generatedContent.seoKeywords && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">SEO Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.seoKeywords.map((keyword: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {generatedContent.bestTimes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Best Times to Post</h3>
                    <div className="space-y-1">
                      {generatedContent.bestTimes.map((time: string, index: number) => (
                        <div key={index} className="text-sm text-foreground/70">{time}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}