"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendingContentProps {
  platform: string;
  className?: string;
}

interface TrendItem {
  type: string;
  value: string;
  metrics: {
    volume?: number;
    growth?: string;
    uses?: number;
    participants?: number;
    posts?: number;
    engagement_rate?: string;
  };
}

export default function TrendingContent({ platform, className = "" }: TrendingContentProps) {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchTrends();
  }, [platform, selectedType]);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      const typeParam = selectedType !== 'all' ? `&type=${selectedType}` : '';
      const response = await fetch(`/api/v1/trends?platform=${platform}${typeParam}`);
      const data = await response.json();
      setTrends(data.trends || []);
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendTypes = () => {
    switch (platform) {
      case 'tiktok':
        return ['all', 'hashtags', 'challenges', 'sounds', 'creators'];
      case 'youtube':
        return ['all', 'topics', 'keywords', 'formats'];
      case 'instagram':
        return ['all', 'hashtags', 'reels', 'filters'];
      case 'twitter':
        return ['all', 'hashtags', 'topics', 'polls'];
      case 'linkedin':
        return ['all', 'topics', 'industries'];
      case 'pinterest':
        return ['all', 'pins', 'boards'];
      default:
        return ['all'];
    }
  };

  const formatMetric = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case 'tiktok': return '🎵';
      case 'youtube': return '📹';
      case 'instagram': return '📸';
      case 'twitter': return '🐦';
      case 'linkedin': return '💼';
      case 'pinterest': return '📌';
      default: return '📊';
    }
  };

  const getPlatformColor = () => {
    switch (platform) {
      case 'tiktok': return 'from-pink-500 to-red-500';
      case 'youtube': return 'from-red-500 to-red-600';
      case 'instagram': return 'from-purple-500 to-pink-500';
      case 'twitter': return 'from-blue-400 to-blue-500';
      case 'linkedin': return 'from-blue-600 to-blue-700';
      case 'pinterest': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPlatformColor()} flex items-center justify-center text-xl`}>
            {getPlatformIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold capitalize">{platform} Trends</h3>
            <p className="text-sm text-foreground/60">Real-time trending content</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-foreground/60">Live</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {getTrendTypes().map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              selectedType === type
                ? `bg-gradient-to-r ${getPlatformColor()} text-white shadow-lg`
                : 'bg-white/10 text-foreground/70 hover:bg-white/20'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Trending Items */}
      <div className="space-y-3">
        <AnimatePresence>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className={`w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin bg-gradient-to-r ${getPlatformColor()} bg-clip-text text-transparent`}></div>
            </div>
          ) : trends.length > 0 ? (
            trends.slice(0, 8).map((trend, index) => (
              <motion.div
                key={`${trend.type}-${trend.value}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {trend.type === 'hashtag' && <span className="text-blue-400">#</span>}
                    {trend.type === 'challenge' && <span className="text-yellow-400">🏆</span>}
                    {trend.type === 'sound' && <span className="text-green-400">🎵</span>}
                    {trend.type === 'topic' && <span className="text-purple-400">💡</span>}
                    {trend.type === 'creator' && <span className="text-pink-400">👤</span>}
                    {trend.type === 'filter' && <span className="text-cyan-400">✨</span>}
                    {trend.type === 'reel' && <span className="text-orange-400">📱</span>}
                    {!['hashtag', 'challenge', 'sound', 'topic', 'creator', 'filter', 'reel'].includes(trend.type) && <span className="text-gray-400">📊</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors duration-200">
                      {trend.value}
                    </p>
                    <p className="text-xs text-foreground/60 capitalize">{trend.type}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end text-right flex-shrink-0">
                  {trend.metrics?.volume && (
                    <span className="text-sm font-medium">{formatMetric(trend.metrics.volume)}</span>
                  )}
                  {trend.metrics?.uses && (
                    <span className="text-sm font-medium">{formatMetric(trend.metrics.uses)} uses</span>
                  )}
                  {trend.metrics?.participants && (
                    <span className="text-sm font-medium">{formatMetric(trend.metrics.participants)} people</span>
                  )}
                  {trend.metrics?.posts && (
                    <span className="text-sm font-medium">{formatMetric(trend.metrics.posts)} posts</span>
                  )}
                  {trend.metrics?.growth && (
                    <span className={`text-xs font-medium ${
                      trend.metrics.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trend.metrics.growth}
                    </span>
                  )}
                  {trend.metrics?.engagement_rate && (
                    <span className="text-xs text-foreground/60">{trend.metrics.engagement_rate} engagement</span>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-foreground/60">
              <p className="text-sm">No trends available for {platform}</p>
              <button 
                onClick={fetchTrends}
                className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors duration-200"
              >
                Try refreshing
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-xs text-foreground/60">
          Updated: {new Date().toLocaleTimeString()}
        </p>
        <button
          onClick={fetchTrends}
          className="text-xs text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );
}