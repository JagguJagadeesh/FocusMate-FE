'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus, Clock, ChevronRight } from 'lucide-react';

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
  work: { label: 'Work', color: '#6366f1', icon: null },
  personal: { label: 'Personal', color: '#ec4899', icon: null },
  urgent: { label: 'Urgent', color: '#f59e0b', icon: null },
  other: { label: 'Other', color: '#8b5cf6', icon: null },
};

interface SchedulerSidebarProps {
  events: Task[];
  onNewTask: () => void;
  onEventClick: (event: any) => void;
}

export default function SchedulerSidebar({ events, onNewTask, onEventClick }: SchedulerSidebarProps) {
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  const stats = [
    { label: 'Total', value: events.length, gradient: 'from-indigo-500 to-blue-600' },
    { label: 'Work', value: events.filter(e => e.category === 'work').length, gradient: 'from-blue-500 to-cyan-600' },
    { label: 'Personal', value: events.filter(e => e.category === 'personal').length, gradient: 'from-pink-500 to-rose-600' },
    { label: 'Urgent', value: events.filter(e => e.category === 'urgent').length, gradient: 'from-amber-500 to-orange-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 space-y-2"
    >
      {/* Create Button */}
      <Button
        onClick={onNewTask}
        className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg text-base font-semibold"
      >
        <Plus className="w-5 h-5 mr-2" />
        New Task
      </Button>

      {/* Upcoming Events Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 shadow-lg hover:shadow-xl transition-shadow"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Upcoming
        </h3>

        <div className="space-y-3 h-60 overflow-auto">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, idx) => {
              const config = categoryConfig[event.category] || categoryConfig.other;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onEventClick({ event: { id: event.id, title: event.title, startStr: event.start, extendedProps: { category: event.category, description: event.description } } })}
                  className="group p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {event.title}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    {config.label}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(event.start).toLocaleDateString()} {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-sm">No upcoming tasks</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        {stats.map(stat => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-3 text-white shadow-lg`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs opacity-90">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
