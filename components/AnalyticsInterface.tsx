"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnalyticsInterfaceProps {
  platform: string;
  platformData: {
    name: string;
    icon: string;
    color: string;
  };
}

interface AnalyticsData {
  engagement: {
    rate: number;
    growth: string;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
  };
  reach: {
    total: number;
    growth: string;
    impressions: number;
    uniqueViews: number;
  };
  content: {
    totalPosts: number;
    avgPerformance: number;
    topPerforming: string;
    successRate: number;
  };
  audience: {
    totalFollowers: number;
    growth: string;
    demographics: {
      age: { '18-24': number; '25-34': number; '35-44': number; '45+': number };
      gender: { male: number; female: number; other: number };
      location: { US: number; UK: number; Canada: number; Other: number };
    };
  };
  recentPosts: Array<{
    id: string;
    content: string;
    date: string;
    engagement: number;
    reach: number;
    performance: 'excellent' | 'good' | 'average' | 'poor';
  }>;
}

export default function AnalyticsInterface({ platform, platformData }: AnalyticsInterfaceProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [platform, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    // Simulate API call with realistic data
    setTimeout(() => {
      setAnalyticsData(generateMockAnalytics(platform));
      setLoading(false);
    }, 1000);
  };

  const generateMockAnalytics = (platform: string): AnalyticsData => {
    const platformMultipliers: Record<string, number> = {
      tiktok: 1.5,
      youtube: 0.8,
      instagram: 1.2,
      twitter: 0.9,
      linkedin: 0.6,
      pinterest: 1.1
    };

    const multiplier = platformMultipliers[platform] || 1;

    return {
      engagement: {
        rate: Math.round((3.2 + Math.random() * 2) * multiplier * 100) / 100,
        growth: `+${Math.round(15 + Math.random() * 30)}%`,
        totalLikes: Math.round((12540 + Math.random() * 50000) * multiplier),
        totalComments: Math.round((2340 + Math.random() * 8000) * multiplier),
        totalShares: Math.round((890 + Math.random() * 3000) * multiplier)
      },
      reach: {
        total: Math.round((2400000 + Math.random() * 5000000) * multiplier),
        growth: `+${Math.round(22 + Math.random() * 40)}%`,
        impressions: Math.round((3200000 + Math.random() * 8000000) * multiplier),
        uniqueViews: Math.round((1800000 + Math.random() * 4000000) * multiplier)
      },
      content: {
        totalPosts: Math.round(45 + Math.random() * 100),
        avgPerformance: Math.round((78 + Math.random() * 20) * 100) / 100,
        topPerforming: getTopContent(platform),
        successRate: Math.round((82 + Math.random() * 15) * 100) / 100
      },
      audience: {
        totalFollowers: Math.round((125000 + Math.random() * 500000) * multiplier),
        growth: `+${Math.round(8 + Math.random() * 25)}%`,
        demographics: {
          age: {
            '18-24': Math.round(25 + Math.random() * 20),
            '25-34': Math.round(35 + Math.random() * 15),
            '35-44': Math.round(20 + Math.random() * 15),
            '45+': Math.round(10 + Math.random() * 10)
          },
          gender: {
            male: Math.round(40 + Math.random() * 20),
            female: Math.round(50 + Math.random() * 20),
            other: Math.round(5 + Math.random() * 5)
          },
          location: {
            US: Math.round(45 + Math.random() * 20),
            UK: Math.round(15 + Math.random() * 10),
            Canada: Math.round(10 + Math.random() * 8),
            Other: Math.round(20 + Math.random() * 15)
          }
        }
      },
      recentPosts: generateRecentPosts(platform)
    };
  };

  const getTopContent = (platform: string): string => {
    const content: Record<string, string> = {
      tiktok: '\"How to go viral in 2025\" dance tutorial',
      youtube: '\"Complete Guide to Content Creation\" tutorial',
      instagram: '\"Aesthetic morning routine\" reel',
      twitter: '\"Thread: 10 content creation tips\" thread',
      linkedin: '\"The Future of Remote Work\" article',
      pinterest: '\"Minimalist Home Decor Ideas\" pin collection'
    };
    return content[platform] || 'Top performing content';
  };

  const generateRecentPosts = (platform: string) => {
    const posts = [];
    const contentTemplates: Record<string, string[]> = {
      tiktok: [
        'Dance challenge with trending song',
        'Quick cooking tutorial',
        'Outfit transition video',
        'Comedy skit about daily life',
        'Educational content about AI'
      ],
      youtube: [
        'Complete guide to social media',
        'Product review and unboxing',
        'Behind the scenes vlog',
        'Tutorial: How to edit videos',
        'Q&A with subscribers'
      ],
      instagram: [
        'Morning routine aesthetic',
        'Fashion outfit of the day',
        'Food photography tips',
        'Travel destination guide',
        'Motivational quote post'
      ],
      twitter: [
        'Thread about productivity tips',
        'Industry news commentary',
        'Personal achievement share',
        'Question to engage audience',
        'Retweet with added thoughts'
      ],
      linkedin: [
        'Professional development insights',
        'Industry trend analysis',
        'Career advice for newcomers',
        'Company culture spotlight',
        'Networking event recap'
      ],
      pinterest: [
        'Home decor inspiration board',
        'Healthy recipe collection',
        'DIY craft tutorial',
        'Fashion trend guide',
        'Travel destination ideas'
      ]
    };

    const templates = contentTemplates[platform] || contentTemplates.instagram;
    const performances: Array<'excellent' | 'good' | 'average' | 'poor'> = ['excellent', 'good', 'average', 'poor'];

    for (let i = 0; i < 8; i++) {
      const daysAgo = i + 1;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      posts.push({
        id: `post-${i}`,
        content: templates[i % templates.length],
        date: date.toISOString().split('T')[0],
        engagement: Math.round(1000 + Math.random() * 10000),
        reach: Math.round(5000 + Math.random() * 50000),
        performance: performances[Math.floor(Math.random() * performances.length)]
      });
    }

    return posts;
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-400 bg-green-400/10';
      case 'good': return 'text-blue-400 bg-blue-400/10';
      case 'average': return 'text-yellow-400 bg-yellow-400/10';
      case 'poor': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-16 text-center">
        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${platformData.color} flex items-center justify-center text-4xl mx-auto mb-8 animate-pulse`}>
          📊
        </div>
        <h2 className="text-2xl font-bold mb-4">Loading Analytics...</h2>
        <div className="flex items-center justify-center">
          <div className={`w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin bg-gradient-to-r ${platformData.color} bg-clip-text text-transparent`}></div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-8 text-center">
        <p>No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platformData.color} flex items-center justify-center text-xl`}>
              📊
            </div>
            <div>
              <h2 className="text-2xl font-bold">{platformData.name} Analytics</h2>
              <p className="text-foreground/60">Track your performance and insights</p>
            </div>
          </div>
          
          <div className="flex gap-2 bg-background p-1 rounded-lg border border-border/50">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  timeRange === range
                    ? `bg-gradient-to-r ${platformData.color} text-white shadow-lg`
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                }`}
              >
                {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background/50 rounded-lg p-6 border border-border/50"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">❤️</span>
              <h3 className="font-semibold">Engagement</h3>
            </div>
            <div className="text-2xl font-bold text-primary">{analyticsData.engagement.rate}%</div>
            <div className={`text-sm font-medium ${analyticsData.engagement.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {analyticsData.engagement.growth} vs last period
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background/50 rounded-lg p-6 border border-border/50"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👥</span>
              <h3 className="font-semibold">Reach</h3>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(analyticsData.reach.total)}</div>
            <div className={`text-sm font-medium ${analyticsData.reach.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {analyticsData.reach.growth} vs last period
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background/50 rounded-lg p-6 border border-border/50"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📈</span>
              <h3 className="font-semibold">Followers</h3>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(analyticsData.audience.totalFollowers)}</div>
            <div className={`text-sm font-medium ${analyticsData.audience.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {analyticsData.audience.growth} vs last period
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background/50 rounded-lg p-6 border border-border/50"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <h3 className="font-semibold">Success Rate</h3>
            </div>
            <div className="text-2xl font-bold text-primary">{analyticsData.content.successRate}%</div>
            <div className="text-sm text-foreground/60">
              {analyticsData.content.totalPosts} posts analyzed
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-6">Top Performing Content</h3>
          <div className="p-4 bg-background/50 rounded-lg border border-border/50 mb-4">
            <div className="font-semibold text-primary mb-2">{analyticsData.content.topPerforming}</div>
            <div className="text-sm text-foreground/60">
              Average performance: {analyticsData.content.avgPerformance}% above benchmark
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Recent Posts</h4>
            {analyticsData.recentPosts.slice(0, 5).map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{post.content}</p>
                  <p className="text-xs text-foreground/60">{post.date}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatNumber(post.engagement)}</div>
                    <div className="text-xs text-foreground/60">engagement</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(post.performance)}`}>
                    {post.performance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Audience Demographics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-6">Audience Demographics</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Age Distribution</h4>
              <div className="space-y-2">
                {Object.entries(analyticsData.audience.demographics.age).map(([age, percentage]) => (
                  <div key={age} className="flex items-center justify-between">
                    <span className="text-sm">{age} years</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-background rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${platformData.color} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Top Locations</h4>
              <div className="space-y-2">
                {Object.entries(analyticsData.audience.demographics.location).map(([location, percentage]) => (
                  <div key={location} className="flex items-center justify-between">
                    <span className="text-sm">{location}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-background rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${platformData.color} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}