'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CalendarIcon, ChevronRight } from 'lucide-react';
import { getAllTasks } from '@/services/userService';
import useUserStore from '@/stores/useUserStore';
import { toast } from 'sonner';
import Link from 'next/link';

type Task = {
  id: string;
  title: string;
  start: string;
  userID: string;
  category: string;
  completed?: boolean;
  description?: string;
};

const categoryConfig = {
  work: { label: 'Work', color: '#6366f1' },
  personal: { label: 'Personal', color: '#ec4899' },
  urgent: { label: 'Urgent', color: '#f59e0b' },
  other: { label: 'Other', color: '#8b5cf6' },
};

export default function SchedulePreview() {
  const [events, setEvents] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, hasHydrated } = useUserStore();

  useEffect(() => {
    if (!hasHydrated || !user.id) return;

    const fetchTasks = async () => {
      try {
        const data = await getAllTasks(user.id);
        setEvents(data.tasks);
      } catch (err) {
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [hasHydrated, user.id]);

  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 4);

  if (!hasHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Tasks</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Next scheduled items</p>
            </div>
          </div>
          <a href="/dashboard/schedule" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors">
            View All →
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading tasks...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 h-64 overflow-auto">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, idx) => {
                const config = categoryConfig[event.category] || categoryConfig.other;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all hover:shadow-md"
                  >
                    <Link href={'/dashboard/schedule'}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {event.title}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-0.5" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                        {config.label}
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(event.start).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-1">
                        {event.description}
                      </p>
                    )}
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No upcoming tasks</p>
                <p className="text-xs mt-1 opacity-75">Create a new task to get started</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
