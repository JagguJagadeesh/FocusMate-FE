'use client'

import React from 'react'
import Scheduler from './Calendar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useUserStore from '@/stores/useUserStore'

export default function Schedule() {
  const userData = useUserStore();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30">
      {/* Enhanced Header */}
      <SidebarInset>
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  My Schedule
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Plan and organize your day {userData.user.name}
                </p>
              </div>
            </div>
          </div>
        </header>
      </SidebarInset>

      {/* Main Content */}
      <main className="w-full max-w-screen-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Scheduler view="dayGridMonth" />
        </motion.div>
      </main>
    </div>
  )
}
