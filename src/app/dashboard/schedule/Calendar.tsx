'use client';

import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import axiosInstance from '@/lib/axiosInstence';
import useUserStore from '@/stores/useUserStore';
import { toast } from 'sonner';

type Task = {
  id: string;
  title: string;
  start: string;
  userID: string;
  category: string;
  completed?: boolean;
};

export default function Scheduler({ view }: { view: string }) {
  const [events, setEvents] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');
  const [category, setCategory] = useState('work');

  const calendarRef = useRef<FullCalendar>(null);
  const { user, hasHydrated } = useUserStore();

  async function getAllTasks(userID: string) {
    const res = await axiosInstance.post('/getalltasks', { userID });
    return res.data;
  }

  useEffect(() => {
    if (!hasHydrated || !user.id) return;

    const fetchTasks = async () => {
      try {
        const data = await getAllTasks(user.id);
        setEvents(data.tasks);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };

    fetchTasks();
  }, [hasHydrated, user.id]);

  const handleDateClick = (arg: DateClickArg) => {
    setTitle('');
    setDatetime(arg.dateStr);
    setCategory('work');
    setEditingEventId(null);
    setOpen(true);
  };

  const handleEventClick = (info: any) => {
    const event = info.event;
    setEditingEventId(event.id);
    setTitle(event.title);
    setDatetime(event.startStr);
    setCategory(event.extendedProps.category || 'work');
    setOpen(true);
  };

  const handleSave = async () => {
    if (!title || !datetime) return;

    const taskPayload: Task = {
      id: editingEventId ?? Date.now().toString(),
      title,
      start: datetime,
      userID: user.id,
      category,
    };

    try {
      if (editingEventId) {
        // Update existing task
        await axiosInstance.post('/updatetask', taskPayload);
        setEvents(prev =>
          prev.map(e => (e.id === editingEventId ? taskPayload : e))
        );
        toast.success('Task Updated Successfully!');
      } else {
        // Add new task
        await axiosInstance.post('/addtask', taskPayload);
        setEvents(prev => [...prev, taskPayload]);
        toast.success('Task Added Successfully!');
      }

      setOpen(false);
      setEditingEventId(null); // reset
    } catch (e) {
      console.error(e);
      toast.error('Something went wrong!');
    }
  };





  const handleDelete = async () => {
    if (!editingEventId) return;
    try {
      await axiosInstance.post('/deletetask', { id: editingEventId });
      toast.success('Task Deleted Successfully...');
      setEvents(prev => prev.filter(e => e.id !== editingEventId));
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEventDrop = async (info: any) => {
    const newStart = info.event.startStr;
    const id = info.event.id;

    const updatedEvent = {
      ...events.find(e => e.id === id)!,
      start: newStart,
    };

    try {
      await axiosInstance.post('/updatetask', {
        id,
        start: newStart,
      });

      setEvents(prev =>
        prev.map(e => (e.id === id ? updatedEvent : e))
      );
    } catch (e) {
      console.error('Failed to update on drag', e);
    }
  };

  if (!hasHydrated) {
    return <div className="w-full text-center p-6">Loading...</div>;
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto">
      <div className="w-full border-2 p-1 overflow-x-auto rounded-lg bg-white dark:bg-zinc-900 shadow">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridDay',
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          editable={true}
          eventDrop={handleEventDrop}
          eventContent={renderEventContent}
          height="auto"
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
              {editingEventId ? 'Edit Task' : 'Add Task'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Task Title
              </label>
              <Input
                placeholder="Enter task name"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                value={datetime}
                onChange={e => setDatetime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Choose</SelectLabel>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end flex-wrap gap-3 pt-4">
              {editingEventId && (
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingEventId ? 'Update' : 'Save'}
              </Button>
              {editingEventId && (
                <Button
                  variant="secondary"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={async () => {
                    try {
                      await axiosInstance.post('/taskdone', {
                        taskId: editingEventId,
                        userID: user.id
                      });

                      toast.success('Marked as Completed');
                      setEvents(prev =>
                        prev.filter(e => e.id !== editingEventId)
                      );
                      setOpen(false);
                    } catch (e) {
                      console.error('Error marking as completed', e);
                    }
                  }}
                >
                  Mark as Completed
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

function renderEventContent(eventInfo: any) {
  const colorMap: Record<string, string> = {
    work: '#3b82f6',      // blue
    personal: '#10b981',  // green
    urgent: '#ef4444',    // red
    other: '#6b7280',     // gray
  };

  const category = eventInfo.event.extendedProps.category;
  const completed = eventInfo.event.extendedProps.completed;
  const color = colorMap[category] || '#000';

  return (
    <div
      className="px-2 py-1 rounded-sm"
      style={{
        borderLeft: `4px solid ${color}`,
        backgroundColor: 'transparent',
        color: '#1f2937', // Tailwind gray-800 for text
        textDecoration: completed ? 'line-through' : 'none',
        fontSize: '',
        fontWeight: 500,
      }}
    >
      <div className='text text-black font-bold'>{eventInfo.event.title}</div>
      <div className='text-xs text-gray-800 font-bold' >
        {eventInfo.timeText}
      </div>
    </div>
  );
}
