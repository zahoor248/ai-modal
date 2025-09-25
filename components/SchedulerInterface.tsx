"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/lib/toast';

interface SchedulerInterfaceProps {
  platform: string;
  platformData: {
    name: string;
    icon: string;
    color: string;
  };
}

interface ScheduledPost {
  id: string;
  platforms: string[];
  content: {
    type: string;
    preview: string;
    hasMedia: boolean;
  };
  scheduledFor: string;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  timezone: string;
  createdAt: string;
  publishedAt?: string;
  error?: string;
}

export default function SchedulerInterface({ platform, platformData }: SchedulerInterfaceProps) {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostData, setNewPostData] = useState({
    content: '',
    scheduleDate: '',
    scheduleTime: '',
    recurring: false,
    frequency: 'daily'
  });
  const { notify } = useToast();

  useEffect(() => {
    loadScheduledPosts();
  }, [platform]);

  const loadScheduledPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/scheduler?platform=${platform}&limit=20`);
      const data = await response.json();
      if (data.success) {
        setScheduledPosts(data.posts);
      }
    } catch (error) {
      console.error('Error loading scheduled posts:', error);
      notify('Failed to load scheduled posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!newPostData.content.trim() || !newPostData.scheduleDate || !newPostData.scheduleTime) {
      notify('Please fill in all required fields', 'error');
      return;
    }

    try {
      const scheduleDateTime = new Date(`${newPostData.scheduleDate}T${newPostData.scheduleTime}`);
      
      const response = await fetch('/api/v1/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: [platform],
          content: {
            text: newPostData.content,
            type: 'post'
          },
          scheduleTime: scheduleDateTime.toISOString(),
          timezone: 'America/New_York',
          recurring: newPostData.recurring ? {
            enabled: true,
            frequency: newPostData.frequency
          } : undefined
        })
      });

      if (response.ok) {
        notify('Post scheduled successfully!', 'success');
        setNewPostData({
          content: '',
          scheduleDate: '',
          scheduleTime: '',
          recurring: false,
          frequency: 'daily'
        });
        setShowNewPost(false);
        loadScheduledPosts();
      } else {
        throw new Error('Failed to schedule post');
      }
    } catch (error) {
      notify('Failed to schedule post', 'error');
    }
  };

  const handleCancelPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/v1/scheduler?id=${postId}&action=cancel`, {
        method: 'PUT'
      });

      if (response.ok) {
        notify('Post cancelled successfully', 'success');
        loadScheduledPosts();
      } else {
        throw new Error('Failed to cancel post');
      }
    } catch (error) {
      notify('Failed to cancel post', 'error');
    }
  };

  const handlePublishNow = async (postId: string) => {
    try {
      const response = await fetch(`/api/v1/scheduler?id=${postId}&action=publish`, {
        method: 'PUT'
      });

      if (response.ok) {
        notify('Post published successfully!', 'success');
        loadScheduledPosts();
      } else {
        throw new Error('Failed to publish post');
      }
    } catch (error) {
      notify('Failed to publish post', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400 bg-blue-400/10';
      case 'published': return 'text-green-400 bg-green-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      case 'cancelled': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getBestPostingTimes = () => {
    const times: Record<string, string[]> = {
      tiktok: ['8-10 PM EST', '6-8 PM EST', '12-2 PM EST'],
      youtube: ['2-4 PM EST', '8-10 AM EST', '6-8 PM EST'],
      instagram: ['11 AM-1 PM EST', '7-9 PM EST', '5-7 AM EST'],
      twitter: ['9 AM EST', '1-3 PM EST', '5 PM EST'],
      linkedin: ['8-10 AM EST', '12 PM EST', '5-6 PM EST'],
      pinterest: ['8-11 PM EST', '2-4 PM EST', '8-10 PM EST']
    };
    return times[platform] || ['9 AM EST', '2 PM EST', '8 PM EST'];
  };

  // Get tomorrow's date for default scheduling
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platformData.color} flex items-center justify-center text-xl`}>
              📅
            </div>
            <div>
              <h2 className="text-2xl font-bold">{platformData.name} Scheduler</h2>
              <p className="text-foreground/60">Schedule and manage your content calendar</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className={`px-6 py-3 bg-gradient-to-r ${platformData.color} text-white rounded-full font-semibold hover:scale-105 transition-all duration-200 shadow-lg`}
          >
            Schedule New Post
          </button>
        </div>

        {/* Best Times */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background/50 rounded-lg p-4 border border-border/50">
            <h3 className="font-semibold mb-2">Best Times to Post</h3>
            <div className="space-y-1 text-sm text-foreground/70">
              {getBestPostingTimes().map((time, index) => (
                <div key={index}>{time}</div>
              ))}
            </div>
          </div>
          
          <div className="bg-background/50 rounded-lg p-4 border border-border/50">
            <h3 className="font-semibold mb-2">Scheduled Posts</h3>
            <div className="text-2xl font-bold text-primary">
              {scheduledPosts.filter(p => p.status === 'scheduled').length}
            </div>
            <div className="text-sm text-foreground/60">This week</div>
          </div>
          
          <div className="bg-background/50 rounded-lg p-4 border border-border/50">
            <h3 className="font-semibold mb-2">Published</h3>
            <div className="text-2xl font-bold text-green-400">
              {scheduledPosts.filter(p => p.status === 'published').length}
            </div>
            <div className="text-sm text-foreground/60">This month</div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewPost(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-lg"
            >
              <h3 className="text-xl font-bold mb-6">Schedule New Post</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    value={newPostData.content}
                    onChange={(e) => setNewPostData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder={`What would you like to post on ${platformData.name}?`}
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-24 resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={newPostData.scheduleDate}
                      onChange={(e) => setNewPostData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                      min={tomorrowString}
                      className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input
                      type="time"
                      value={newPostData.scheduleTime}
                      onChange={(e) => setNewPostData(prev => ({ ...prev, scheduleTime: e.target.value }))}
                      className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={newPostData.recurring}
                    onChange={(e) => setNewPostData(prev => ({ ...prev, recurring: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-background border border-border rounded focus:ring-2 focus:ring-primary"
                  />
                  <label htmlFor="recurring" className="text-sm">Recurring post</label>
                </div>
                
                {newPostData.recurring && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency</label>
                    <select
                      value={newPostData.frequency}
                      onChange={(e) => setNewPostData(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewPost(false)}
                  className="flex-1 px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSchedulePost}
                  className={`flex-1 px-4 py-2 bg-gradient-to-r ${platformData.color} text-white rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg`}
                >
                  Schedule Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scheduled Posts List */}
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-6">Scheduled Posts</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className={`w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin mx-auto bg-gradient-to-r ${platformData.color} bg-clip-text text-transparent`}></div>
          </div>
        ) : scheduledPosts.length === 0 ? (
          <div className="text-center py-8 text-foreground/60">
            <p>No scheduled posts yet</p>
            <button
              onClick={() => setShowNewPost(true)}
              className="mt-4 text-primary hover:text-primary/80 transition-colors duration-200"
            >
              Schedule your first post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-background/50 border border-border/50 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                      <span className="text-sm text-foreground/60">
                        {new Date(post.scheduledFor).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 mb-2">{post.content.preview}</p>
                    {post.error && (
                      <p className="text-sm text-red-400">{post.error}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {post.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handlePublishNow(post.id)}
                          className="px-3 py-1 bg-green-500/10 text-green-400 rounded text-xs hover:bg-green-500/20 transition-colors duration-200"
                        >
                          Publish Now
                        </button>
                        <button
                          onClick={() => handleCancelPost(post.id)}
                          className="px-3 py-1 bg-red-500/10 text-red-400 rounded text-xs hover:bg-red-500/20 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}