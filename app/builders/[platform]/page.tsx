"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TrendingContent from '@/components/TrendingContent';
// import AIContentBuilder from '@/components/AIContentBuilder';
import SchedulerInterface from '@/components/SchedulerInterface';

interface PlatformData {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  features: string[];
}

const platformsData: Record<string, PlatformData> = {
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: 'from-pink-500 to-red-500',
    description: 'Create viral short-form videos with trending sounds and challenges',
    features: ['Trending Hashtags', 'Viral Challenges', 'Popular Sounds', 'Video Effects']
  },
  youtube: {
    id: 'youtube', 
    name: 'YouTube',
    icon: '📹',
    color: 'from-red-500 to-red-600',
    description: 'Build engaging long-form content with SEO optimization',
    features: ['Trending Topics', 'SEO Keywords', 'Thumbnail Generation', 'Analytics']
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram', 
    icon: '📸',
    color: 'from-purple-500 to-pink-500',
    description: 'Design stunning posts, stories, and reels for maximum engagement',
    features: ['Reels Trends', 'Story Templates', 'Hashtag Research', 'Filters & Effects']
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦', 
    color: 'from-blue-400 to-blue-500',
    description: 'Craft compelling tweets and threads that spark conversations',
    features: ['Trending Topics', 'Thread Creation', 'Poll Integration', 'Real-time Trends']
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: 'from-blue-600 to-blue-700', 
    description: 'Create professional content that builds thought leadership',
    features: ['Industry Trends', 'Professional Topics', 'Article Creation', 'Network Insights']
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    color: 'from-red-500 to-pink-500',
    description: 'Design eye-catching pins that drive traffic and engagement',
    features: ['Trending Pins', 'Board Optimization', 'SEO Descriptions', 'Seasonal Trends']
  }
};

export default function PlatformBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const platform = params.platform as string;
  const [activeTab, setActiveTab] = useState<'trends' | 'builder' | 'analytics' | 'scheduler'>('trends');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const platformData = platformsData[platform];

  useEffect(() => {
    if (!platformData) {
      router.push('/dashboard');
    }
  }, [platform, platformData, router]);

  if (!platformData) {
    return <div>Loading...</div>;
  }

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/v1/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platform,
          type: 'post',
          topic: 'viral content creation',
          audience: 'content creators',
          tone: 'inspiring',
          includeHashtags: true,
          includeEmojis: true
        })
      });
      
      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg bg-card hover:bg-accent transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platformData.color} flex items-center justify-center text-xl`}>
              {platformData.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{platformData.name} Content Builder</h1>
              <p className="text-foreground/60">{platformData.description}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 bg-card p-1 rounded-lg border border-border/50 mb-8">
          {[
            { key: 'trends', label: 'Live Trends', icon: '📈' },
            { key: 'builder', label: 'AI Builder', icon: '✨' },
            { key: 'analytics', label: 'Analytics', icon: '📊' },
            { key: 'scheduler', label: 'Scheduler', icon: '📅' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? `bg-gradient-to-r ${platformData.color} text-white shadow-lg`
                  : 'text-foreground/70 hover:text-foreground hover:bg-accent'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'trends' && (
            <TrendingContent platform={platform} />
          )}

          {activeTab === 'builder' && (
            <div className="bg-card border border-border/50 rounded-2xl p-8 text-center">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${platformData.color} flex items-center justify-center text-3xl mx-auto mb-6`}>
                ✨
              </div>
              <h2 className="text-3xl font-bold mb-4">AI Content Generator</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto mb-8">
                Generate viral content optimized for {platformData.name} using AI and real-time trends.
                Full AI content builder coming online shortly...
              </p>
              <button
                className={`px-8 py-4 bg-gradient-to-r ${platformData.color} text-white rounded-full font-semibold hover:scale-105 transition-all duration-200 shadow-lg`}
              >
                Generate {platformData.name} Content
              </button>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-card border border-border/50 rounded-2xl p-8 text-center">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${platformData.color} flex items-center justify-center text-3xl mx-auto mb-6`}>
                📊
              </div>
              <h2 className="text-3xl font-bold mb-4">{platformData.name} Analytics</h2>
              <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
                Track your {platformData.name} performance with detailed analytics, 
                engagement metrics, and growth insights to optimize your content strategy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-background/50 rounded-lg p-6 border border-border/50">
                  <div className="text-2xl font-bold text-green-400">+127%</div>
                  <div className="text-sm text-foreground/60">Engagement Growth</div>
                </div>
                <div className="bg-background/50 rounded-lg p-6 border border-border/50">
                  <div className="text-2xl font-bold text-blue-400">2.4M</div>
                  <div className="text-sm text-foreground/60">Total Reach</div>
                </div>
                <div className="bg-background/50 rounded-lg p-6 border border-border/50">
                  <div className="text-2xl font-bold text-purple-400">89%</div>
                  <div className="text-sm text-foreground/60">Success Rate</div>
                </div>
              </div>
              <button className={`px-8 py-3 bg-gradient-to-r ${platformData.color} text-white rounded-full font-semibold hover:scale-105 transition-transform duration-200 shadow-lg`}>
                View Detailed Analytics
              </button>
            </div>
          )}

          {activeTab === 'scheduler' && (
            <SchedulerInterface platform={platform} platformData={platformData} />
          )}
        </motion.div>
      </div>
    </div>
  );
}