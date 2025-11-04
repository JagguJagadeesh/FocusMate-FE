'use client';

import React, { useEffect, useState } from 'react';
import { DateClickArg } from '@fullcalendar/interaction';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Trash2, CheckCircle2 } from 'lucide-react';
import { getAllTasks } from '@/services/userService';
import SchedulerSidebar from '@/components/myuicomponents/SchedulerSidebar';
import SchedulerCalendar from '@/components/myuicomponents/SchedulerCalendar';
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
  work: { label: 'Work', gradient: 'from-indigo-500 to-blue-600' },
  personal: { label: 'Personal', gradient: 'from-pink-500 to-rose-600' },
  urgent: { label: 'Urgent', gradient: 'from-amber-500 to-orange-600' },
  other: { label: 'Other', gradient: 'from-violet-500 to-purple-600' },
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

  const { user, hasHydrated } = useUserStore();

  useEffect(() => {
    if (!hasHydrated || !user.id) return;

    const fetchTasks = async () => {
      setIsLoading(false);
      try {
        const data = await getAllTasks(user.id);
        setEvents(data.tasks);
      } catch (err) {
        toast.error('Failed to load tasks');
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
      toast.error('Fill in title and date');
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
        setEvents(prev => prev.map(e => e.id === editingEventId ? taskPayload : e));
        toast.success('Task updated');
      } else {
        await axiosInstance.post('/addtask', taskPayload);
        setEvents(prev => [...prev, taskPayload]);
        toast.success('Task created');
      }
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await axiosInstance.post('/deletetask', { id: taskId });
      setEvents(prev => prev.filter(e => e.id !== taskId));
      setDeleteConfirm(null);
      setOpen(false);
      toast.success('Task deleted');
      // window.location.reload();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      await axiosInstance.post('/taskdone', { taskId, userID: user.id });
      setEvents(prev => prev.filter(e => e.id !== taskId));
      setOpen(false);
      toast.success('Task completed');
    } catch (error) {
      toast.error('Failed to complete');
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
      await axiosInstance.post('/updatetask', { id, start: newStart });
      setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
      toast.success('Task moved');
    } catch (error) {
      info.revert();
      toast.error('Failed to move');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDatetime('');
    setCategory('work');
    setDescription('');
  };

  if (!hasHydrated) {
    return <div className="flex items-center justify-center h-96"><Component/></div>;
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="flex mt-2 gap-4 px-2">
        {/* Sidebar */}
        <SchedulerSidebar
          events={events}
          onNewTask={() => {
            resetForm();
            setOpen(true);
          }}
          onEventClick={handleEventClick}
        />

        {/* Calendar */}
        <SchedulerCalendar
          isLoading={isLoading}
          events={events}
          view={view}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
          onEventDrop={handleEventDrop}
        />
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-0 border-0 overflow-hidden">
          <div className={`bg-gradient-to-br ${categoryConfig[category].gradient} p-6 text-white`}>
            <h2 className="text-2xl font-bold">{editingEventId ? 'Edit Task' : 'New Task'}</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Task title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="rounded-xl border-2"
              />
            </div>

            <div className="space-y-2">
              <Label>Date & Time</Label>
              <input
                type="datetime-local"
                value={datetime}
                onChange={e => setDatetime(e.target.value)}
                className="w-full px-4 py-2 border-2 rounded-xl dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    className={`p-3 rounded-xl border-2 transition-all ${category === key
                      ? `bg-gradient-to-r ${config.gradient} text-white border-transparent`
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                      }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Add details..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="rounded-xl border-2 resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              {editingEventId && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteConfirm(editingEventId)}
                    className="px-4 rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleComplete(editingEventId)}
                    className="px-4 rounded-xl border-green-300 text-green-600 hover:bg-green-50"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Done
                  </Button>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex-1 bg-gradient-to-r ${categoryConfig[category].gradient} text-white rounded-xl`}
              >
                {isSaving ? 'Saving...' : editingEventId ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
