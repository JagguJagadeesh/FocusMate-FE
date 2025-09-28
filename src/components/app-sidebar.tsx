'use client'

import * as React from "react"
import {
  BookOpen,
  ChartNoAxesGantt,
  GraduationCap,
  Telescope
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user" 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar"
import Link from "next/link"
import { motion } from "framer-motion"
import useUserStore from "@/stores/useUserStore"
import ProductLogo from "./ProductLogo"
import SidebarTimerPomodoro from "./Pomodoro"

// Navigation configuration
const navigationConfig = {
  navMain: [
    {
      title: "My Learning",
      url: "#",
      icon: ChartNoAxesGantt,
      isActive: true,
      items: [
        {
          title: "Schedule",
          url: "/dashboard/schedule",
        },
        {
          title: "Playlists",
          url: "/dashboard/playlist",
        },
        {
          title: "Notes", 
          url: "/dashboard/notes",
        }
      ],
    },
    {
      title: "Documents",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "My Books",
          url: "/dashboard/books",
        },
        {
          title: "My PDFs",
          url: "/dashboard/pdfs",
        }
      ],
    },
    {
      title: "Explore",
      url: "#", 
      icon: Telescope,
      items: [
        {
          title: "Community",
          url: "/community",
        },
        {
          title: "Events",
          url: "/dashboard/events",
        }
      ],
    },
  ],
}

// Logo Component
const SidebarLogo = React.memo(({ collapsed }: { collapsed: boolean }) => {
  return (
    <Link 
      href="/dashboard" 
      className="flex items-center justify-center group"
    >
      <motion.div
        animate={{ 
          scale: collapsed ? 0.8 : 1,
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          scale: { duration: 0.3, ease: "easeInOut" },
          opacity: { duration: 2, repeat: Infinity }
        }}
        className="relative overflow-hidden rounded-lg "
      >
        {collapsed ? (
          <div className="flex items-center">
            <GraduationCap width={30} height={40}/>
          </div>
        ) : (
          <ProductLogo/>
        )}
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      </motion.div>
    </Link>
  )
})

SidebarLogo.displayName = "SidebarLogo"

// Main Sidebar Component
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userData = useUserStore(state => state.user)
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-zinc-200/50 dark:border-zinc-700/50 bg-white/80 dark:bg-black backdrop-blur-xl"
      {...props}
    >
      {/* Header Section */}
      <SidebarHeader className="border-b border-zinc-200/30 dark:border-zinc-700/30 bg-gradient-to-r from-purple-50/30 to-blue-50/30 dark:from-purple-900/10 dark:to-blue-900/10">
        <SidebarLogo collapsed={isCollapsed} />
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="bg-gradient-to-b from-transparent via-zinc-50/20 to-zinc-100/20 dark:from-transparent dark:via-zinc-800/20 dark:to-zinc-900/20">
        <div className="flex flex-col gap-2">
          {/* Main Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NavMain items={navigationConfig.navMain} />
          </motion.div>
          
          {/* Responsive Pomodoro Timer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SidebarTimerPomodoro isCollapsed={isCollapsed} />
          </motion.div>
        </div>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter className="border-t border-zinc-200/30 dark:border-zinc-700/30 bg-gradient-to-r from-zinc-50/50 to-zinc-100/50 dark:from-zinc-800/50 dark:to-zinc-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <NavUser user={userData} />
        </motion.div>
      </SidebarFooter>

      {/* Sidebar Rail */}
      <SidebarRail />
    </Sidebar>
  )
}
