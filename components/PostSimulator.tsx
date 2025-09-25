"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PostSimulatorProps {
  platform: string;
  content: any;
  platformData: {
    name: string;
    icon: string;
    color: string;
  };
}

export default function PostSimulator({ platform, content, platformData }: PostSimulatorProps) {
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');

  if (!content) {
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-8 text-center">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platformData.color} flex items-center justify-center text-2xl mx-auto mb-4`}>
          📱
        </div>
        <h3 className="text-xl font-semibold mb-2">Post Preview</h3>
        <p className="text-foreground/60">Generate content to see how it will look on {platformData.name}</p>
      </div>
    );
  }

  const renderTikTokPreview = () => (
    <div className="bg-black rounded-3xl p-4 max-w-sm mx-auto overflow-hidden">
      <div className="relative bg-gray-900 rounded-2xl aspect-[9/16] overflow-hidden">
        {/* TikTok UI Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4">
          <div className="flex items-center justify-between text-white">
            <div className="text-sm">Following</div>
            <div className="text-sm font-semibold">For You</div>
            <div className="w-4"></div>
          </div>
        </div>

        {/* Video Content Area */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
          <div className="text-6xl animate-pulse">🎵</div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-4 text-white">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full mb-1"></div>
            <span className="text-xs">+</span>
          </div>
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-xs">24.2K</span>
          </div>
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
            <span className="text-xs">1,891</span>
          </div>
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
            <span className="text-xs">Share</span>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="mb-3">
            <div className="font-semibold mb-1">@creator_username</div>
            <p className="text-sm line-clamp-2">{content.caption || content.description || 'Amazing content!'}</p>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {content.hashtags?.slice(0, 3).map((tag: string, index: number) => (
              <span key={index} className="text-xs text-blue-300">{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <span>Trending Audio • 1.2M videos</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderYouTubePreview = () => (
    <div className="bg-black rounded-2xl p-4 max-w-2xl mx-auto">
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        {/* Video Player */}
        <div className="aspect-video bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center relative">
          <div className="text-6xl text-white">▶️</div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {content.targetDuration || '10:24'}
          </div>
        </div>
        
        {/* Video Info */}
        <div className="p-4 text-white">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {content.title || 'Your YouTube Video Title'}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
            <span>1,234 views • 2 hours ago</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                👍 <span>128</span>
              </span>
              <span className="flex items-center gap-1">
                👎 <span>3</span>
              </span>
              <span>Share</span>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                YT
              </div>
              <div>
                <div className="font-semibold">Your Channel</div>
                <div className="text-xs text-gray-400">1.2K subscribers</div>
              </div>
              <button className="ml-auto bg-red-600 text-white px-4 py-1 rounded-full text-sm">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-300 line-clamp-3">
              {content.description || 'Your video description will appear here...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInstagramPreview = () => (
    <div className="bg-white rounded-3xl p-4 max-w-sm mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
          <span className="font-semibold text-sm">your_username</span>
        </div>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </div>

      {/* Image/Video */}
      <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-3 flex items-center justify-center">
        <div className="text-4xl text-white">📸</div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-4">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
        </div>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
        </svg>
      </div>

      {/* Likes and Caption */}
      <div className="text-sm">
        <div className="font-semibold mb-1">1,234 likes</div>
        <div>
          <span className="font-semibold">your_username</span>{' '}
          <span>{content.caption || 'Your Instagram caption goes here...'}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {content.hashtags?.slice(0, 5).map((tag: string, index: number) => (
            <span key={index} className="text-blue-500">{tag}</span>
          ))}
        </div>
        <div className="text-gray-500 mt-2 text-xs">2 hours ago</div>
      </div>
    </div>
  );

  const renderTwitterPreview = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-lg mx-auto">
      <div className="flex gap-3">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          TW
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold">Your Name</span>
            <span className="text-gray-500">@your_handle</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500 text-sm">2h</span>
          </div>
          
          {content.tweets ? (
            // Thread preview
            <div className="space-y-3">
              {content.tweets.slice(0, 3).map((tweet: string, index: number) => (
                <div key={index} className="text-gray-900">
                  <p className="mb-2">{tweet}</p>
                  {index < content.tweets.length - 1 && (
                    <div className="text-blue-500 text-sm">Show this thread</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-900 mb-3">
              {content.tweet || content.post || 'Your tweet content goes here...'}
            </p>
          )}

          {content.hashtags && (
            <div className="flex flex-wrap gap-1 mb-3">
              {content.hashtags.slice(0, 3).map((tag: string, index: number) => (
                <span key={index} className="text-blue-500">{tag}</span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-gray-500 text-sm max-w-xs">
            <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
              <span>42</span>
            </div>
            <div className="flex items-center gap-1 hover:text-green-500 cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"/>
              </svg>
              <span>18</span>
            </div>
            <div className="flex items-center gap-1 hover:text-red-500 cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>156</span>
            </div>
            <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLinkedInPreview = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-lg mx-auto">
      <div className="flex gap-3 mb-3">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          LI
        </div>
        <div className="flex-1">
          <div className="font-semibold">Your Professional Name</div>
          <div className="text-sm text-gray-600">Your Job Title • 2nd</div>
          <div className="text-xs text-gray-500">2h • 🌍</div>
        </div>
        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </div>

      <div className="text-gray-900 mb-3">
        <p>{content.post || content.title || 'Your LinkedIn post content goes here...'}</p>
        {content.hashtags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {content.hashtags.slice(0, 5).map((tag: string, index: number) => (
              <span key={index} className="text-blue-600">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.5 15.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S6 13.17 6 14s.67 1.5 1.5 1.5zm0-9C8.33 6.5 9 5.83 9 5s-.67-1.5-1.5-1.5S6 4.17 6 5s.67 1.5 1.5 1.5zM3 9.5c.83 0 1.5-.67 1.5-1.5S3.83 6.5 3 6.5 1.5 7.17 1.5 8 2.17 9.5 3 9.5zm3.5 .5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM8 5c0-.83-.67-1.5-1.5-1.5S5 4.17 5 5s.67 1.5 1.5 1.5S8 5.83 8 5z"/>
            </svg>
            <span>👍 42</span>
          </div>
          <span>8 comments</span>
          <span>2 reposts</span>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 flex-1 justify-center py-2">
          <span>👍</span> Like
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 flex-1 justify-center py-2">
          <span>💭</span> Comment
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 flex-1 justify-center py-2">
          <span>🔄</span> Repost
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 flex-1 justify-center py-2">
          <span>📤</span> Send
        </button>
      </div>
    </div>
  );

  const renderPinterestPreview = () => (
    <div className="bg-white rounded-2xl overflow-hidden max-w-sm mx-auto shadow-lg">
      {/* Pin Image */}
      <div className="aspect-[3/4] bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center relative group cursor-pointer">
        <div className="text-4xl text-white">📌</div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Pin Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {content.pinTitle || content.title || 'Your Pinterest Pin Title'}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {content.description || 'Your pin description goes here...'}
        </p>
        
        {content.seoKeywords && (
          <div className="flex flex-wrap gap-1 mb-3">
            {content.seoKeywords.slice(0, 3).map((keyword: string, index: number) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {keyword}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            YB
          </div>
          <span className="text-sm font-medium text-gray-900">Your Board</span>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (platform) {
      case 'tiktok': return renderTikTokPreview();
      case 'youtube': return renderYouTubePreview();
      case 'instagram': return renderInstagramPreview();
      case 'twitter': return renderTwitterPreview();
      case 'linkedin': return renderLinkedInPreview();
      case 'pinterest': return renderPinterestPreview();
      default: return <div>Preview not available for this platform</div>;
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platformData.color} flex items-center justify-center text-xl`}>
            📱
          </div>
          <div>
            <h3 className="text-xl font-bold">Live Preview</h3>
            <p className="text-foreground/60">See how your content will look on {platformData.name}</p>
          </div>
        </div>

        <div className="flex gap-2 bg-background p-1 rounded-lg border border-border/50">
          <button
            onClick={() => setDeviceView('mobile')}
            className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
              deviceView === 'mobile'
                ? `bg-gradient-to-r ${platformData.color} text-white shadow-lg`
                : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            📱 Mobile
          </button>
          <button
            onClick={() => setDeviceView('desktop')}
            className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
              deviceView === 'desktop'
                ? `bg-gradient-to-r ${platformData.color} text-white shadow-lg`
                : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            💻 Desktop
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${platform}-${deviceView}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`${deviceView === 'desktop' ? 'scale-90' : 'scale-100'} transition-transform duration-300`}
        >
          {renderPreview()}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 text-center">
        <p className="text-sm text-foreground/60">
          Live preview updates automatically as you modify your content
        </p>
      </div>
    </div>
  );
}