'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from '../ui/skeleton'

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-zinc-700/20">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="text-center space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <Skeleton className="w-6 h-6 mx-auto mb-2 rounded" />
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
        
        {/* Progress */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    </motion.div>
  )
}

// Posts Skeleton
export function PostsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50"
          >
            {/* Post Header */}
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            
            {/* Post Image */}
            <Skeleton className="w-full h-64 rounded-xl mb-4" />
            
            {/* Post Content */}
            <div className="space-y-3 mb-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            
            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <div className="flex gap-4">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-8 w-12 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Leaderboard Skeleton
export function LeaderboardSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-zinc-700/20">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="h-6 w-24" />
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl"
          >
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="w-4 h-4" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Generic Content Skeleton
export function ContentSkeleton({ 
  rows = 3, 
  showAvatar = false,
  showImage = false,
  className = ""
}: {
  rows?: number
  showAvatar?: boolean
  showImage?: boolean
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-4 ${className}`}
    >
      {showAvatar && (
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      )}
      
      {showImage && <Skeleton className="w-full h-48 rounded-xl" />}
      
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={`h-4 ${
              i === rows - 1 ? 'w-3/4' : 'w-full'
            }`} 
          />
        ))}
      </div>
    </motion.div>
  )
}
