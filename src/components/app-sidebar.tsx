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
} from "@/components/ui/sidebar"
import Image from "next/image"
import logo from '@/lib/logo.png'
import Link from "next/link"
import useUserStore from "@/stores/useUserStore"

// This is sample data.
const data = {
  user: {
    name: "Jagadeesh",
    email: "test@example.com",
    avatar: "Jaggu",
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
          url: "#",
        },
        {
          title: "My PDF's",
          url: "#",
        },
        {
          title: "Notes",
          url: "#",
        },
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
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
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

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <Link className="flex flex-col items-center" href='/dashboard'><Image src={logo} width={150} height={150} alt="jbdc" /></Link>
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
