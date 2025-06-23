'use client'

import React from 'react'
import Scheduler from './Calendar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator' // use correct separator import
import useUserStore from '@/stores/useUserStore'

export default function Schedule() {
  const userData = useUserStore(s=>s.user)
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar + Header */}
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 px-4 border-b bg-background/80 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <h2 className="text-lg font-semibold">{userData.name} Your&apos;s Schedule</h2>
        </header>
      </SidebarInset>

      {/* Calendar Container */}
      <main className="w-full max-w-screen-2xl mx-auto">
        <div className="shadow-sm overflow-x-auto">
          <Scheduler view="dayGridMonth" />
        </div>
      </main>
    </div>
  )
}
