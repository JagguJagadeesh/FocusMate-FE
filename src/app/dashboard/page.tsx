'use client'

import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import SchedulePreview from "@/components/myuicomponents/SchedulePreview"
import UserChart from './progress/UserChart'
import { motion } from 'framer-motion'
import {
  PenTool,
  Calendar as CalendarIcon,
  Music,
  BarChart3,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@radix-ui/react-separator"

const shortcuts = [
  {
    label: "Create Note",
    link: "/tabs/draw",
    icon: <PenTool className="w-6 h-6" />,
    description: "Start taking notes and sketching ideas",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-950/30"
  },
  {
    label: "Schedule Session",
    link: "/dashboard/schedule",
    icon: <CalendarIcon className="w-6 h-6" />,
    description: "Plan and organize your study time",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    hoverColor: "hover:bg-purple-100 dark:hover:bg-purple-950/30"
  },
  {
    label: "Focus Playlist",
    link: "/dashboard/playlist",
    icon: <Music className="w-6 h-6" />,
    description: "Curated music for deep focus",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    hoverColor: "hover:bg-emerald-100 dark:hover:bg-emerald-950/30"
  },
]

export default function DashboardPage() {
  return (
    <>
      <SidebarInset>
        {/* Clean Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6 space-y-8 bg-gray-50/30 dark:bg-gray-950/30 min-h-screen">

          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 p-8 text-white"
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-6 h-6" />
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Welcome back!</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Ready to focus and achieve your goals?</h2>
              <p className="text-white/90 text-lg">You&apos;re on a 15-day study streak. Keep the momentum going!</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 right-8 w-20 h-20 bg-white/5 rounded-full translate-y-10"></div>
          </motion.div>

          {/* Quick Actions */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Start something new</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(shortcuts || []).map((item, i) => (
                <Link href={item.link} key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer ${item.hoverColor}`}
                  >
                    <div className="p-6">
                      <div className={`inline-flex p-3 rounded-xl ${item.bgColor} ${item.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {item.icon}
                      </div>

                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-3 gap-2 transition-all duration-300">
                        <span>Get started</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>


          {/* Schedule Preview - Full Width */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SchedulePreview />
          </motion.section>

          {/* Chart Section - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Progress Overview</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last 7 days performance</p>
                  </div>
                </div>
                <Link href="/analytics" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm transition-colors">
                  Details →
                </Link>
              </div>
            </div>
            <div className="p-6">
              <UserChart />
            </div>
          </motion.div>
        </div>
      </SidebarInset>
    </>
  )
}
