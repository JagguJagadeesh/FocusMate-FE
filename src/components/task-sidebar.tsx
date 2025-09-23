'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import axiosInstance from '@/lib/axiosInstence'
import useUserStore from '@/stores/useUserStore'

// Types
interface Task {
  id: string
  title: string
  start: string
  category: 'work' | 'personal' | 'urgent' | 'other'
  completed?: boolean
}

interface TaskItemProps {
  task: Task
  index: number
}

// Category configuration
const categoryConfig = {
  work: {
    color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    icon: '💼'
  },
  personal: {
    color: 'border-green-500 bg-green-50 dark:bg-green-950/20',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    icon: '🏠'
  },
  urgent: {
    color: 'border-red-500 bg-red-50 dark:bg-red-950/20',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    icon: '🚨'
  },
  other: {
    color: 'border-zinc-400 bg-zinc-50 dark:bg-zinc-950/20',
    badgeColor: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300',
    icon: '📋'
  }
}

// Task Item Component
const TaskItem = ({ task, index }: TaskItemProps) => {
  const config = categoryConfig[task.category]
  const taskDate = new Date(task.start)
  const isToday = taskDate.toDateString() === new Date().toDateString()
  const isPast = taskDate < new Date()

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`group relative overflow-hidden rounded-xl border-l-4 ${config.color} 
        hover:shadow-md transition-all duration-200 cursor-pointer`}
    >
      <div className="p-3 space-y-2">
        {/* Task Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{config.icon}</span>
              {isToday && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-orange-500 rounded-full"
                />
              )}
            </div>
            <h4 className="font-medium text-sm text-foreground leading-tight break-words">
              {task.title}
            </h4>
          </div>
          
          <Badge className={`text-[10px] capitalize shrink-0 ${config.badgeColor} border-0`}>
            {task.category}
          </Badge>
        </div>

        {/* Task Time */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span className={isToday ? 'text-orange-600 font-medium' : ''}>
              {isToday ? 'Today' : taskDate.toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              {taskDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Status Indicator */}
        {isPast && !task.completed && (
          <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-3 h-3" />
            <span>Overdue</span>
          </div>
        )}

        {task.completed && (
          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </div>
        )}
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </motion.li>
  )
}

// Loading Skeleton
const TaskSkeleton = () => (
  <div className="space-y-3 p-1">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-3 rounded-xl bg-muted/50 space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    ))}
  </div>
)

// Empty State
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-8 text-center"
  >
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
      <Calendar className="w-6 h-6 text-muted-foreground" />
    </div>
    <p className="text-sm text-muted-foreground mb-3">No tasks scheduled</p>
    <Link href="/dashboard/schedule">
      <Button variant="outline" size="sm" className="gap-2">
        <Plus className="w-4 h-4" />
        Add Task
      </Button>
    </Link>
  </motion.div>
)

// Error State
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-6 text-center"
  >
    <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
    <p className="text-sm text-muted-foreground mb-3">Failed to load tasks</p>
    <Button variant="outline" size="sm" onClick={onRetry}>
      Try Again
    </Button>
  </motion.div>
)

// Main Component
export default function TaskSidebar() {
  const { user } = useUserStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchTasks = useCallback(async () => {
    if (!user.id) return

    try {
      setLoading(true)
      setError(false)
      
      const response = await axiosInstance.post('/getalltasks', { 
        userID: user.id 
      })

      const sortedTasks = (response.data.tasks || [])
        .sort((a: Task, b: Task) => 
          new Date(b.start).getTime() - new Date(a.start).getTime()
        )
        .slice(0, 10) // Limit to 10 most recent tasks

      setTasks(sortedTasks)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const upcomingTasks = tasks.filter(task => 
    new Date(task.start) >= new Date() && !task.completed
  ).slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-4 px-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
          <h3 className="text-sm font-semibold text-foreground">
            My Tasks
          </h3>
        </div>
        {tasks.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {upcomingTasks.length}
          </Badge>
        )}
      </div>

      {/* Tasks Container */}
      <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <ScrollArea className="h-[200px]">
          <div className="p-3">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TaskSkeleton />
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ErrorState onRetry={fetchTasks} />
                </motion.div>
              ) : upcomingTasks.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyState />
                </motion.div>
              ) : (
                <motion.ul
                  key="tasks"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {upcomingTasks.map((task, index) => (
                    <TaskItem key={task.id} task={task} index={index} />
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      {/* Footer Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3"
      >
        <Link href="/dashboard/schedule">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between gap-2 text-xs h-8 hover:bg-muted/80 transition-colors"
          >
            <span>View all tasks</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  )
}
