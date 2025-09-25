"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TrendingContent from './TrendingContent';

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  features: string[];
}

const platforms: Platform[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: 'from-pink-500 to-red-500',
    description: 'Create viral short-form videos with trending sounds and challenges',
    features: ['Trending Hashtags', 'Viral Challenges', 'Popular Sounds', 'Video Effects']
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📹',
    color: 'from-red-500 to-red-600',
    description: 'Build engaging long-form content with SEO optimization',
    features: ['Trending Topics', 'SEO Keywords', 'Thumbnail Generation', 'Analytics']
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: 'from-purple-500 to-pink-500',
    description: 'Design stunning posts, stories, and reels for maximum engagement',
    features: ['Reels Trends', 'Story Templates', 'Hashtag Research', 'Filters & Effects']
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    color: 'from-blue-400 to-blue-500',
    description: 'Craft compelling tweets and threads that spark conversations',
    features: ['Trending Topics', 'Thread Creation', 'Poll Integration', 'Real-time Trends']
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: 'from-blue-600 to-blue-700',
    description: 'Create professional content that builds thought leadership',
    features: ['Industry Trends', 'Professional Topics', 'Article Creation', 'Network Insights']
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    color: 'from-red-500 to-pink-500',
    description: 'Design eye-catching pins that drive traffic and engagement',
    features: ['Trending Pins', 'Board Optimization', 'SEO Descriptions', 'Seasonal Trends']
  }
];

export default function ContentBuilderHub() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'trends' | 'analytics'>('trends');

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <div className="space-y-8">
      {/* Platform Selection Grid */}
      {!selectedPlatform && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPlatform(platform.id)}
              className="group cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {platform.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-foreground/60">Content Builder</p>
                </div>
              </div>
              
              <p className="text-sm text-foreground/70 mb-4 leading-relaxed">
                {platform.description}
              </p>
              
              <div className="space-y-2">
                {platform.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-foreground/60">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${platform.color}`}></div>
                    {feature}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="text-xs font-medium text-primary group-hover:text-primary/80 transition-colors duration-300">
                  Open Builder →
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Selected Platform Interface */}
      {selectedPlatform && selectedPlatformData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Platform Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedPlatform(null)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedPlatformData.color} flex items-center justify-center text-xl`}>
                {selectedPlatformData.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedPlatformData.name} Content Builder</h2>
                <p className="text-foreground/60">{selectedPlatformData.description}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
            {[
              { key: 'trends', label: 'Live Trends', icon: '📈' },
              { key: 'builder', label: 'Content Builder', icon: '✨' },
              { key: 'analytics', label: 'Analytics', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? `bg-gradient-to-r ${selectedPlatformData.color} text-white shadow-lg`
                    : 'text-foreground/70 hover:text-foreground hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'trends' && (
              <motion.div
                key="trends"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TrendingContent platform={selectedPlatform} />
              </motion.div>
            )}

            {activeTab === 'builder' && (
              <motion.div
                key="builder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedPlatformData.color} flex items-center justify-center text-3xl mx-auto mb-6`}>
                  ✨
                </div>
                <h3 className="text-2xl font-bold mb-4">AI Content Builder</h3>
                <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
                  Our AI-powered content builder for {selectedPlatformData.name} is coming soon! 
                  Create viral content optimized for this platform with trending topics, hashtags, and formats.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {selectedPlatformData.features.map((feature, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="text-sm font-medium">{feature}</div>
                    </div>
                  ))}
                </div>
                <button className={`px-8 py-3 bg-gradient-to-r ${selectedPlatformData.color} text-white rounded-full font-semibold hover:scale-105 transition-transform duration-200 shadow-lg`}>
                  Get Early Access
                </button>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedPlatformData.color} flex items-center justify-center text-3xl mx-auto mb-6`}>
                  📊
                </div>
                <h3 className="text-2xl font-bold mb-4">Platform Analytics</h3>
                <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
                  Track your {selectedPlatformData.name} performance with detailed analytics, 
                  engagement metrics, and growth insights to optimize your content strategy.
                </p>
                <button className={`px-8 py-3 bg-gradient-to-r ${selectedPlatformData.color} text-white rounded-full font-semibold hover:scale-105 transition-transform duration-200 shadow-lg`}>
                  View Analytics
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}