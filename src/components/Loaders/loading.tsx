'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardLoading() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700 flex flex-col">
          <div className="p-4">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-5 h-5 rounded" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Loading */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header Skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-b border-zinc-200 dark:border-zinc-700 p-6"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <div className="flex-1 p-6 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-indigo-100/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                  </div>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </motion.div>
              ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {[1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50"
                  >
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-48 w-full rounded-xl mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 h-fit"
              >
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLoading
