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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axiosInstance from '@/lib/axiosInstence';
import useUserStore from '@/stores/useUserStore';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  Tag,
  Trash2,
  CheckCircle,
  X,
  Save,
  Briefcase,
  User,
  AlertTriangle,
  MoreHorizontal,
  FileText,
  Loader2
} from 'lucide-react';
import { getAllTasks } from '@/services/userService';

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
  work: {
    label: 'Work',
    icon: <Briefcase className="w-4 h-4" />,
    color: '#3b82f6',
    bgColor: 'from-blue-500 to-blue-600',
    lightBg: 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30'
  },
  personal: {
    label: 'Personal',
    icon: <User className="w-4 h-4" />,
    color: '#10b981',
    bgColor: 'from-green-500 to-green-600',
    lightBg: 'from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30'
  },
  urgent: {
    label: 'Urgent',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: '#ef4444',
    bgColor: 'from-red-500 to-red-600',
    lightBg: 'from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30'
  },
  other: {
    label: 'Other',
    icon: <MoreHorizontal className="w-4 h-4" />,
    color: '#6b7280',
    bgColor: 'from-gray-500 to-gray-600',
    lightBg: 'from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/30'
  }
};

export default function Scheduler({ view }: { view: string }) {
  const [events, setEvents] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');
  const [category, setCategory] = useState('work');
  const [description, setDescription] = useState('');

  const calendarRef = useRef<FullCalendar>(null);
  const { user, hasHydrated } = useUserStore();

  

  useEffect(() => {
    if (!hasHydrated || !user.id) return;

    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const data = await getAllTasks(user.id);
        setEvents(data.tasks);
      } catch (err) {
        // console.error('Failed to fetch tasks:', err);
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [hasHydrated, user.id]);

  const handleDateClick = (arg: DateClickArg) => {
    setTitle('');
    setDatetime(arg.dateStr);
    setCategory('work');
    setDescription('');
    setEditingEventId(null);
    setOpen(true);
  };

  const handleEventClick = (info: any) => {
    const event = info.event;
    setEditingEventId(event.id);
    setTitle(event.title);
    setDatetime(event.startStr);
    setCategory(event.extendedProps.category || 'work');
    setDescription(event.extendedProps.description || '');
    setOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !datetime) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    const taskPayload: Task = {
      id: editingEventId ?? Date.now().toString(),
      title: title.trim(),
      start: datetime,
      userID: user.id,
      category,
      description: description.trim()
    };

    try {
      if (editingEventId) {
        await axiosInstance.post('/updatetask', taskPayload);
        setEvents(prev =>
          prev.map(e => (e.id === editingEventId ? taskPayload : e))
        );
        toast.success('Task updated successfully!', {
          description: 'Your changes have been saved.'
        });
      } else {
        await axiosInstance.post('/addtask', taskPayload);
        setEvents(prev => [...prev, taskPayload]);
        toast.success('Task added successfully!', {
          description: 'Your new task has been created.'
        });
      }

      setOpen(false);
      setEditingEventId(null);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!', {
        description: 'Please try again later.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await axiosInstance.post('/deletetask', { id: taskId });
      toast.success('Task deleted successfully');
      setEvents(prev => prev.filter(e => e.id !== taskId));
      setDeleteConfirm(null);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete task');
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      await axiosInstance.post('/taskdone', {
        taskId,
        userID: user.id
      });
      toast.success('Task marked as completed!');
      setEvents(prev => prev.filter(e => e.id !== taskId));
      setOpen(false);
    } catch (error) {
      console.error('Error marking as completed', error);
      toast.error('Failed to complete task');
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

      toast.success('Task moved successfully');
    } catch (error) {
      console.error('Failed to update on drag', error);
      toast.error('Failed to move task');
      info.revert();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDatetime('');
    setCategory('work');
    setDescription('');
  };

  const safeEvents = events || [];

const stats = {
  total: safeEvents.length,
  work: safeEvents.filter(e => e.category === 'work').length,
  personal: safeEvents.filter(e => e.category === 'personal').length,
  urgent: safeEvents.filter(e => e.category === 'urgent').length,
  today: safeEvents.filter(e => {
    const today = new Date().toDateString();
    const taskDate = new Date(e.start).toDateString();
    return today === taskDate;
  }).length
};


  if (!hasHydrated) {
    return (
      <div className="w-full flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Stats Overview */}
      {view==='dayGridMonth'?
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Total Tasks', value: stats.total, icon: <CalendarIcon className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
          { label: 'Work', value: stats.work, icon: <Briefcase className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' },
          { label: 'Personal', value: stats.personal, icon: <User className="w-5 h-5" />, color: 'from-green-500 to-green-600' },
          { label: 'Urgent', value: stats.urgent, icon: <AlertTriangle className="w-5 h-5" />, color: 'from-red-500 to-red-600' },
          { label: 'Today', value: stats.today, icon: <Clock className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>: ''}

      {/* Calendar Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading your schedule...</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
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
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              editable={true}
              eventDrop={handleEventDrop}
              eventContent={renderEventContent}
              height="auto"
              dayMaxEvents={3}
              moreLinkClick="popover"
              eventDisplay="block"
              dayHeaderClassNames="text-gray-600 dark:text-gray-400 font-semibold"
              dayCellClassNames="hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
            />
          </div>
        )}
      </motion.div>

      {/* Enhanced Task Dialog */}
      <Dialog open={open} onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetForm();
          setEditingEventId(null);
        }
      }}>
        <DialogContent className="w-full max-w-md max-h-[90vh] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-white dark:bg-gray-900">
          {/* Compact Dialog Header */}
          <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-1.5 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <DialogHeader className="space-y-2 pr-8">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white text-left">
                {editingEventId ? 'Edit Task' : 'Create Task'}
              </DialogTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                {editingEventId ? 'Update task details' : 'Add new task to schedule'}
              </p>
            </DialogHeader>
          </div>

          {/* Scrollable Dialog Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-4 space-y-4">
              {/* Task Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  Task Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Enter task title..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Date & Time */}
              <div className="space-y-1.5">
                <Label htmlFor="datetime" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Date & Time *
                </Label>
                <input
                  id="datetime"
                  type="datetime-local"
                  className="w-full h-10 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={datetime}
                  onChange={e => setDatetime(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectGroup>
                      <SelectLabel>Choose Category</SelectLabel>
                      {Object.entries((categoryConfig || [])).map(([key, config]) => (
                        <SelectItem key={key} value={key} className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            {config.icon}
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add task description..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="min-h-[60px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows={3}
                />
              </div>

              {/* Compact Action Buttons */}
              <div className="pt-2 space-y-3">
                {/* Edit Actions Row */}
                {editingEventId && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteConfirm(editingEventId)}
                      className="flex-1 h-9 px-3 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20 rounded-lg text-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleComplete(editingEventId)}
                      className="flex-1 h-9 px-3 border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/20 rounded-lg text-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                      Complete
                    </Button>
                  </div>
                )}

                {/* Main Actions Row */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="flex-1 h-10 px-4 rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 h-10 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        {editingEventId ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 mr-1.5" />
                        {editingEventId ? 'Update' : 'Create'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Task?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This action cannot be undone. The task will be permanently removed from your schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteConfirm(null)}
              className="rounded-xl"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function renderEventContent(eventInfo: any) {
  const category = eventInfo.event.extendedProps.category || 'other';
  const config = categoryConfig[category] || categoryConfig.other;
  const completed = eventInfo.event.extendedProps.completed;

  return (
    <div
      className="px-3 py-2 rounded-lg shadow-sm border-l-4 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200 cursor-pointer group"
      style={{
        borderLeftColor: config.color,
        textDecoration: completed ? 'line-through' : 'none',
        opacity: completed ? 0.7 : 1
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {config.label}
          </span>
        </div>
      </div>

      <div className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {eventInfo.event.title}
      </div>

      {eventInfo.timeText && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {eventInfo.timeText}
        </div>
      )}
    </div>
  );
}
