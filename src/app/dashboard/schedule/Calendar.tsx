'use client'

import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Turret_Road } from 'next/font/google'
import axiosInstance from '@/lib/axiosInstence'
import useUserStore from '@/stores/useUserStore'
import { toast } from 'sonner'

const caveat = Turret_Road({
  subsets: ['latin'],
  weight: '500'
})

type Task = {
  id: string
  title: string
  start: string
  userID: string
  category: string
}

const categoryColors: Record<string, string> = {
  work: '#3b82f6',
  personal: '#10b981',
  urgent: '#ef4444',
  other: '#a855f7',
}

export default function Scheduler({view}: {view: string}) {
  const [events, setEvents] = useState<Task[]>([])
  const [open, setOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  
  const [title, setTitle] = useState('')
  const [datetime, setDatetime] = useState('')
  const [category, setCategory] = useState('work')
  
  const calendarRef = useRef<FullCalendar>(null)
  const { user, hasHydrated } = useUserStore();
  
  async function getAllTasks(userID: string) {
    const res = await axiosInstance.post('/getalltasks',{userID})
    // console.log(res)
    return res.data
  }
  useEffect(() => {
  if (!hasHydrated || !user.id) return; // wait for hydration and valid user

  const fetchTasks = async () => {
    try {
      const data = await getAllTasks(user.id);
      setEvents(data.tasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

      fetchTasks();
  }, [hasHydrated, user.id]);


  const handleDateClick = (arg: DateClickArg) => {
    setTitle('')
    setDatetime(arg.dateStr)
    setCategory('work')
    setEditingEventId(null)
    setOpen(true)
  }

  const handleEventClick = (info: any) => {
    const event = info.event
    setEditingEventId(event.id)
    setTitle(event.title)
    setDatetime(event.startStr)
    setCategory(event.extendedProps.category || 'work')
    setOpen(true)
  }

  const handleSave = async () => {
    if (!title || !datetime) return

    const newEvent: Task = {
      id: editingEventId ?? Date.now().toString(),
      title,
      start: datetime,
      userID: user.id,
      category,
    }
    try {
      const res = await axiosInstance.post('/addtask',newEvent);
      // console.log(res)
    } catch (e) {
      console.log(e)
    }
    toast.success('Task Added Successfully...')
    setEvents(prev =>
      editingEventId
        ? prev.map(e => (e.id === editingEventId ? newEvent : e))
        : [...prev, newEvent]
    )
    // console.log(events)
    setOpen(false)
  }

  const handleDelete = async () => {
    if (!editingEventId) return
    try {
      const res = await axiosInstance.post('/deletetask',{id: editingEventId});
      // console.log(res)
    } catch (e) {
      console.log(e)
    }
    toast.success('Task Deleted Successfully...')
    setEvents(prev => prev.filter(e => e.id !== editingEventId))
    setOpen(false)
  }

  const handleEventDrop = (info: any) => {
    const updated = events.map(event =>
      event.id === info.event.id
        ? { ...event, start: info.event.startStr }
        : event
    )
    setEvents(updated)
  }
  if (!hasHydrated) {
    return <div>Loading...</div>;
  }
  return (
    <div className={`p-4 ${caveat.className}`}>
      <h2 className="text-3xl font-bold text-center mb-6">My Schedule</h2>

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95%] max-w-md rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl flex justify-between items-center">
              {editingEventId ? 'Edit Task' : 'Add Task'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Task Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <input
              type="datetime-local"
              className="w-full border rounded px-2 py-2"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
            />
            <div className='w-full'>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Work" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Importance</SelectLabel>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              {editingEventId && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function renderEventContent(eventInfo: any) {
  const color = categoryColors[eventInfo.event.extendedProps.category] || '#6b7280'
  return (
    <div
      style={{
        backgroundColor: color,
      }}
      className={`text-white text-wrap rounded-lg px-1 py-1 text-xl`}
    >
      <p className='text-sm'>{eventInfo.event.title}</p>
    </div>
  )
}
