"use client"

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
import useUserStore from "@/stores/useUserStore"
import ProductLogo from "./ProductLogo"
import SidebarTimerPomodoro from "./myuicomponents/Pomodoro"

// Configuration data
const navigationData = {
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
          url: "/dashboard/community",
        },
        {
          title: "Events",
          url: "/dashboard/events",
        }
      ],
    }
  ],
}

// Logo Component
const SidebarLogo = React.memo(({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <Link href="/dashboard" className="flex items-center justify-center w-full">
      {isCollapsed ? (
        <div className="flex items-center justify-center mt-1.5 rounded-lg font-bold">
          <GraduationCap width={24} height={24} />
        </div>
      ) : (
        <div className="flex">
          <ProductLogo />
        </div>
      )}
    </Link>
  )
})

SidebarLogo.displayName = "SidebarLogo"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userData = useUserStore(state => state.user)
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarLogo isCollapsed={isCollapsed} />
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="space-y-4">
        <NavMain items={navigationData.navMain} />
        <div className="px-2 py-2">
          <SidebarTimerPomodoro isCollapsed={isCollapsed} />
        </div>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>

      {/* Rail */}
      <SidebarRail />
    </Sidebar>
  )
}
