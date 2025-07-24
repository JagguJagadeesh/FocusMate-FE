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
import { 
  PenTool, 
  Calendar as CalendarIcon, 
  Music, 
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  Flame,
  BookOpen,
  BarChart3,
  ArrowRight,
  Sparkles
} from 'lucide-react'

const quickStats = [
  {
    label: "Study Hours Today",
    value: "4.2h",
    change: "+12%",
    trend: "up",
    icon: <Clock className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  {
    label: "Goals Completed",
    value: "8/12",
    change: "67%",
    trend: "up", 
    icon: <Target className="w-5 h-5" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-800"
  },
  {
    label: "Study Streak",
    value: "15 days",
    change: "New Record!",
    trend: "up",
    icon: <Flame className="w-5 h-5" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800"
  },
  {
    label: "Focus Score",
    value: "92%",
    change: "+8%",
    trend: "up",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800"
  }
]

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
    link: "/tabs/schedule",
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
  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <>
      <SidebarInset>
        {/* Clean Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-2 px-6 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentTime}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="font-medium">All systems operational</span>
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
          
          {/* Quick Stats */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Today&apos;s Progress</h3>
              <Link 
                href="/analytics" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
              >
                View Analytics
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border ${stat.borderColor} shadow-sm hover:shadow-lg transition-all duration-300`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        stat.trend === 'up' 
                          ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30' 
                          : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

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
              {shortcuts.map((item, i) => (
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

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today&apos;s Schedule</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">3 sessions planned</p>
                    </div>
                  </div>
                  <Link href="/tabs/schedule" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors">
                    View All →
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <Calendar view={'timeGridDay'} />
              </div>
            </motion.div>

            {/* Chart Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                <Link href="/activity" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors">
                  View All →
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {[
                  { 
                    action: "Completed Mathematics Study Session", 
                    time: "2 hours ago", 
                    icon: <BookOpen className="w-4 h-4" />,
                    color: "text-blue-600",
                    bgColor: "bg-blue-50 dark:bg-blue-950/20"
                  },
                  { 
                    action: "Added new goal: Complete React Tutorial", 
                    time: "4 hours ago", 
                    icon: <Target className="w-4 h-4" />,
                    color: "text-emerald-600",
                    bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
                  },
                  { 
                    action: "Achieved 7-day study streak", 
                    time: "Yesterday", 
                    icon: <Flame className="w-4 h-4" />,
                    color: "text-orange-600",
                    bgColor: "bg-orange-50 dark:bg-orange-950/20"
                  },
                ].map((activity, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-all duration-200 group"
                  >
                    <div className={`p-2 ${activity.bgColor} rounded-lg ${activity.color} group-hover:scale-110 transition-transform duration-200`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{activity.action}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </SidebarInset>
    </>
  )
}
