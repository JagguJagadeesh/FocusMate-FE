'use client';

import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { motion } from 'framer-motion';
import { Component } from '@/components/Loaders/loding';

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

interface SchedulerCalendarProps {
  isLoading: boolean;
  events: Task[];
  view: string;
  onDateClick: (arg: DateClickArg) => void;
  onEventClick: (info: any) => void;
  onEventDrop: (info: any) => void;
}

export default function SchedulerCalendar({
  isLoading,
  events,
  view,
  onDateClick,
  onEventClick,
  onEventDrop,
}: SchedulerCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow p-4"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <Component />
          </div>
        </div>
      ) : (
        <>
          <style>{`
            .fc {
              font-family: inherit;
            }
            .fc .fc-button-primary {
              background-color: #6366f1;
              border-color: #6366f1;
            }
            .fc .fc-button-primary:hover {
              background-color: #4f46e5;
            }
            .fc .fc-button-primary.fc-button-active {
              background-color: #4f46e5;
            }
            .fc .fc-daygrid-day:hover {
              background-color: rgba(99, 102, 241, 0.05);
            }
            .fc .fc-daygrid-day.fc-day-today {
              background-color: rgba(99, 102, 241, 0.1);
            }
            .fc-theme-standard .fc-col-header-cell {
              background-color: rgba(99, 102, 241, 0.05);
              border-color: rgba(99, 102, 241, 0.1);
            }
            .dark .fc-theme-standard .fc-col-header-cell {
              background-color: rgba(99, 102, 241, 0.1);
            }
          `}</style>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            dateClick={onDateClick}
            eventClick={onEventClick}
            editable={true}
            eventDrop={onEventDrop}
            eventContent={renderEventContent}
            height="33rem"
            dayMaxEvents={2}
          />
        </>
      )}
    </motion.div>
  );
}

function renderEventContent(eventInfo: any) {
  const category = eventInfo.event.extendedProps.category || 'other';
  const config = categoryConfig[category];

  return (
    <div className="px-1 rounded-lg text-xs font-semibold truncate" style={{
      backgroundColor: config.color + '20',
      color: config.color,
      borderLeft: `3px solid ${config.color}`
    }}>
      {eventInfo.event.title}
    </div>
  );
}
