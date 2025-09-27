"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  TrendingUp,
  Zap,
  Users,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HeroSection() {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      
      {/* Animated Background Blobs */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge 
                variant="outline" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-indigo-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400"
              >
                <Sparkles className="w-3 h-3" />
                AI-Powered Social Media Builder
                <TrendingUp className="w-3 h-3" />
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Build Social Content{' '}
              </span>
              <span className="bg-gradient-to-r from-pink-400 to-indigo-600 bg-clip-text text-transparent">
                10x Faster
              </span>
              <br />
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Using AI + Real Trends
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              Generate viral content for Instagram, TikTok, YouTube & more. 
              Our AI analyzes real trends and creates platform-optimized posts 
              that drive engagement and grow your audience.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center gap-8 text-sm"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <span className="font-semibold">12,000+</span>
                <span className="text-muted-foreground">creators</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">2M+</span>
                <span className="text-muted-foreground">posts generated</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">300%</span>
                <span className="text-muted-foreground">avg. engagement boost</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Try It Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 rounded-full border-2 hover:bg-accent transition-all duration-300 transform hover:scale-[1.02] group"
                onClick={() => {
                  // Open demo modal or scroll to demo section
                  document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Micro Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-sm text-muted-foreground"
            >
              No credit card needed. Cancel anytime. Start creating in 30 seconds.
            </motion.p>
          </motion.div>

          {/* Right Side - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative"
          >
            {/* Main Visual Container */}
            <div className="relative">
              {/* Floating Cards Animation */}
              <motion.div
                className="relative w-full max-w-md mx-auto"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Main Phone Mockup */}
                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-2 shadow-2xl">
                  <div className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-[2rem] p-6 h-[600px] overflow-hidden">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-xs font-semibold">9:41</div>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                        <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                        <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Interface Preview */}
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">Content Builder</h3>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-indigo-600"></div>
                      </div>

                      {/* Platform Selector */}
                      <div className="flex gap-2">
                        {['📷', '🎵', '📺', '🐦'].map((emoji, i) => (
                          <motion.div
                            key={i}
                            className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-lg"
                            animate={{ scale: i === 0 ? [1, 1.1, 1] : 1 }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                          >
                            {emoji}
                          </motion.div>
                        ))}
                      </div>

                      {/* Content Preview */}
                      <div className="bg-gradient-to-br from-pink-50 to-indigo-50 dark:from-pink-900/20 dark:to-indigo-900/20 rounded-xl p-4 space-y-3">
                        <div className="h-32 bg-gradient-to-br from-pink-200 to-indigo-200 dark:from-pink-800/40 dark:to-indigo-800/40 rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-foreground/20 rounded w-full"></div>
                          <div className="h-3 bg-foreground/10 rounded w-4/5"></div>
                        </div>
                        <div className="flex gap-1">
                          {['#viral', '#ai', '#content'].map((tag, i) => (
                            <span key={i} className="text-xs bg-accent px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <motion.div
                        className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-xl p-4 text-center font-semibold"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        ✨ Generate with AI
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-8 -right-8 bg-green-500 text-white rounded-full p-3 shadow-lg"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <TrendingUp className="w-6 h-6" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-8 bg-pink-500 text-white rounded-full p-3 shadow-lg"
                animate={{ 
                  y: [0, -10, 0],
                  x: [0, 5, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-12 bg-indigo-500 text-white rounded-full p-3 shadow-lg"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 360]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              >
                <Zap className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-2 rounded-full hover:bg-accent transition-colors duration-300 group"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
      </motion.button>
    </section>
  );
}