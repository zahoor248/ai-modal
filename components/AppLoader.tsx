"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface AppLoaderProps {
  isLoading?: boolean;
  message?: string;
}

export default function AppLoader({ isLoading = true, message = "Loading your content..." }: AppLoaderProps) {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-indigo-600 flex items-center justify-center shadow-2xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <motion.path
                d="M3 7.5C3 5 5 3 7.5 3h9C19 3 21 5 21 7.5v9C21 19 19 21 16.5 21h-9C5 21 3 19 3 16.5v-9z"
                fill="currentColor"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
          
          {/* Pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-pink-400/30"
            animate={{
              scale: [1, 1.2, 1.4],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-indigo-400/30"
            animate={{
              scale: [1, 1.3, 1.6],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.3
            }}
          />
        </motion.div>

        {/* Brand Text */}
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
            StoryBuds
          </h1>
          <p className="text-sm text-muted-foreground mt-1">AI Social Media Platform</p>
        </motion.div>

        {/* Progress Dots */}
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Loading Message */}
        <motion.p
          className="text-sm text-muted-foreground text-center max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
}

// Quick loader for smaller transitions
export function QuickLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-indigo-600 flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="text-white"
        >
          <path
            d="M3 7.5C3 5 5 3 7.5 3h9C19 3 21 5 21 7.5v9C21 19 19 21 16.5 21h-9C5 21 3 19 3 16.5v-9z"
            fill="currentColor"
          />
        </svg>
      </motion.div>
    </div>
  );
}