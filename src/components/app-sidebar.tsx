"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  ChartNoAxesGantt,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Telescope
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
// import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import logo from '@/lib/logo.png'
import smallLogo from '@/lib/hatlogo.jpeg'
import Link from "next/link"
import useUserStore from "@/stores/useUserStore"

// This is sample data.
const data = {
  user: {
    name: "Jagadeesh",
    email: "test@example.com",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
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
          title: "Play Lists",
          url: "/dashboard/playlist",
        },
        {
          title: "Notes",
          url: "/dashboard/notes",
        },
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
          title: "My PDF's",
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
        },
        {
          title: "Team",
          url: "/dashboard/team",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userData = useUserStore(s=>s.user)
  const collapsed  = false

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <Link className="flex flex-col items-center" href='/dashboard'>
        {collapsed ? (
            <Image
              src={smallLogo}
              alt="Compact Logo"
              width={40}
              height={40}
              className="transition-all duration-200"
            />
          ) : (
            <Image
              src={logo}
              alt="Full Logo"
              width={220}
              height={150}
              className="transition-all rounded duration-200"
            />
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
