"use client";

import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
}

export default function LoadingState({ 
  message = "Loading...", 
  size = 'md', 
  variant = 'spinner',
  className = "" 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`} role="status" aria-live="polite">
        <div 
          className={`${sizeClasses[size]} border-3 border-foreground/20 border-t-primary rounded-full animate-spin`}
          aria-hidden="true"
        />
        {message && (
          <p className={`${textSizes[size]} text-foreground/70 font-medium`}>
            {message}
          </p>
        )}
        <span className="sr-only">{message}</span>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`} role="status" aria-live="polite">
        <div className="flex space-x-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-primary rounded-full`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        {message && (
          <p className={`${textSizes[size]} text-foreground/70 font-medium text-center`}>
            {message}
          </p>
        )}
        <span className="sr-only">{message}</span>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`} role="status" aria-live="polite">
        <motion.div
          className={`${sizeClasses[size]} bg-primary rounded-full`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          aria-hidden="true"
        />
        {message && (
          <p className={`${textSizes[size]} text-foreground/70 font-medium text-center`}>
            {message}
          </p>
        )}
        <span className="sr-only">{message}</span>
      </div>
    );
  }

  return null;
}

// Skeleton loading component for content placeholders
export function SkeletonLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`} aria-hidden="true">
      <div className="bg-foreground/10 rounded-lg"></div>
    </div>
  );
}

// Card skeleton for loading cards/posts
export function CardSkeleton() {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6" aria-hidden="true">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-foreground/10 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-foreground/10 rounded w-3/4"></div>
            <div className="h-3 bg-foreground/10 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-foreground/10 rounded"></div>
          <div className="h-4 bg-foreground/10 rounded w-5/6"></div>
          <div className="h-4 bg-foreground/10 rounded w-4/6"></div>
        </div>
        <div className="h-32 bg-foreground/10 rounded-lg"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-foreground/10 rounded-full w-16"></div>
          <div className="h-6 bg-foreground/10 rounded-full w-20"></div>
          <div className="h-6 bg-foreground/10 rounded-full w-12"></div>
        </div>
      </div>
    </div>
  );
}