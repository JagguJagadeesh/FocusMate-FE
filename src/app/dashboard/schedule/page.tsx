'use client'
import React from 'react'
import Calendar from './Calendar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'


export default function Schedule() {
  return (
    <div>
      <SidebarInset>
        <header className="absolute flex h-16 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
      </SidebarInset>
      <Calendar/>
    </div>
  )
}
