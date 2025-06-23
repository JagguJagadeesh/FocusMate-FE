'use client'

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Calendar from './schedule/Calendar'
import UserChart from './progress/UserChart'
import { motion } from 'framer-motion'
import ChatBotPopup from '@/components/ChatBox' // ⬅️ Add this

export default function DashboardPage() {
  return (
    <>
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 items-center gap-2 px-4 border-b">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </header>

        {/* Main Content */}
        <div className="flex flex-col gap-6 p-4">
          {/* Shortcut Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Create Note", link: "/tabs/draw" },
              { label: "Create Schedule", link: "/tabs/schedule" },
              { label: "My Playlist", link: "/dashboard/playlist" },
            ].map((item, i) => (
              <Link href={item.link} key={i}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="aspect-video flex items-center justify-center rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 dark:from-neutral-800 dark:to-neutral-700 text-black dark:text-white shadow-md transition-all"
                >
                  <p className="text-2xl font-semibold">{item.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Calendar Section */}
          <div className="rounded-xl bg-muted/50 p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Today&apos;s Schedule</h3>
            <Calendar view={'timeGridDay'} />
          </div>

          {/* Chart Section */}
          <div className="rounded-xl bg-muted/50 p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Progress Overview</h3>
            <div className="p-4">
              <UserChart />
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Chatbot Popup Floating Component */}
      <ChatBotPopup />
    </>
  )
}
