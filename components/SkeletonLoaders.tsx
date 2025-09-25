"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Enhanced skeleton with shimmer effect
function SkeletonBase({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`relative overflow-hidden bg-muted/50 rounded-md ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {children}
    </div>
  );
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header skeleton */}
      <div className="space-y-4">
        <SkeletonBase className="h-8 w-64" />
        <SkeletonBase className="h-4 w-96" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <SkeletonBase className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <SkeletonBase className="h-8 w-16 mb-2" />
              <SkeletonBase className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <SkeletonBase className="w-12 h-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <SkeletonBase className="h-4 w-3/4" />
                    <SkeletonBase className="h-3 w-1/2" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <SkeletonBase className="h-4 w-full" />
                <SkeletonBase className="h-4 w-5/6" />
                <SkeletonBase className="h-32 w-full rounded-lg" />
                <div className="flex space-x-2">
                  <SkeletonBase className="h-6 w-16 rounded-full" />
                  <SkeletonBase className="h-6 w-20 rounded-full" />
                  <SkeletonBase className="h-6 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <SkeletonBase className="h-5 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <SkeletonBase className="w-8 h-8 rounded-lg" />
                  <SkeletonBase className="h-4 flex-1" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Post builder skeleton
export function PostBuilderSkeleton() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Builder */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <SkeletonBase className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Platform selector */}
              <div className="space-y-3">
                <SkeletonBase className="h-4 w-24" />
                <div className="flex flex-wrap gap-3">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonBase key={i} className="h-10 w-24 rounded-lg" />
                  ))}
                </div>
              </div>

              {/* Content type */}
              <div className="space-y-3">
                <SkeletonBase className="h-4 w-32" />
                <div className="flex gap-3">
                  {[...Array(3)].map((_, i) => (
                    <SkeletonBase key={i} className="h-10 w-20 rounded-lg" />
                  ))}
                </div>
              </div>

              {/* Caption input */}
              <div className="space-y-3">
                <SkeletonBase className="h-4 w-16" />
                <SkeletonBase className="h-32 w-full rounded-lg" />
              </div>

              {/* Hashtags */}
              <div className="space-y-3">
                <SkeletonBase className="h-4 w-20" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(8)].map((_, i) => (
                    <SkeletonBase key={i} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <SkeletonBase className="h-10 w-24 rounded-lg" />
                <SkeletonBase className="h-10 w-32 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <SkeletonBase className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Phone mockup */}
                <div className="mx-auto w-64 h-96 bg-muted/30 rounded-3xl p-4">
                  <div className="w-full h-full bg-muted/50 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center space-x-3">
                      <SkeletonBase className="w-8 h-8 rounded-full" />
                      <SkeletonBase className="h-3 w-20" />
                    </div>
                    <SkeletonBase className="h-48 w-full rounded-lg" />
                    <div className="space-y-2">
                      <SkeletonBase className="h-3 w-full" />
                      <SkeletonBase className="h-3 w-3/4" />
                    </div>
                    <div className="flex space-x-2">
                      <SkeletonBase className="h-6 w-12 rounded-full" />
                      <SkeletonBase className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Simple content skeleton
export function ContentSkeleton({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <SkeletonBase 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}

// Card skeleton for lists
export function CardSkeleton({ showImage = true }: { showImage?: boolean }) {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <SkeletonBase className="w-10 h-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <SkeletonBase className="h-4 w-3/4" />
            <SkeletonBase className="h-3 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ContentSkeleton lines={2} />
        {showImage && <SkeletonBase className="h-48 w-full rounded-lg" />}
        <div className="flex space-x-2">
          <SkeletonBase className="h-6 w-16 rounded-full" />
          <SkeletonBase className="h-6 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {[...Array(columns)].map((_, i) => (
          <SkeletonBase key={i} className="h-4 w-full" />
        ))}
      </div>
      
      {/* Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {[...Array(columns)].map((_, colIndex) => (
            <SkeletonBase key={colIndex} className="h-8 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}