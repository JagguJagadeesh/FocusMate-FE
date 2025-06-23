'use client'

import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import axiosInstance from '@/lib/axiosInstence'
import useUserStore from '@/stores/useUserStore'
import { toast } from 'sonner'

type Task = {
  id: string
  title: string
  start: string
  userID: string
  category: string
}

const categoryColors: Record<string, string> = {
  work: 'blue-600',
  personal: 'green-500',
  urgent: 'red-500',
  other: 'white',
}

export default function Scheduler({ view }: { view: string }) {
  const [events, setEvents] = useState<Task[]>([])
  const [open, setOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [datetime, setDatetime] = useState('')
  const [category, setCategory] = useState('work')

  const calendarRef = useRef<FullCalendar>(null)
  const { user, hasHydrated } = useUserStore()

  async function getAllTasks(userID: string) {
    const res = await axiosInstance.post('/getalltasks', { userID })
    return res.data
  }

  useEffect(() => {
    if (!hasHydrated || !user.id) return

    const fetchTasks = async () => {
      try {
        const data = await getAllTasks(user.id)
        setEvents(data.tasks)
      } catch (err) {
        console.error("Failed to fetch tasks:", err)
      }
    }

    fetchTasks()
  }, [hasHydrated, user.id])

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
      await axiosInstance.post('/addtask', newEvent)
    } catch (e) {
      console.error(e)
    }

    toast.success('Task Added Successfully...')
    setEvents(prev =>
      editingEventId
        ? prev.map(e => (e.id === editingEventId ? newEvent : e))
        : [...prev, newEvent]
    )

    setOpen(false)
  }

  const handleDelete = async () => {
    if (!editingEventId) return
    try {
      await axiosInstance.post('/deletetask', { id: editingEventId })
    } catch (e) {
      console.error(e)
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
    return <div className="w-full text-center p-6">Loading...</div>
  }

  return (
    <div className=" w-full max-w-screen-2xl mx-auto">
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
        <DialogContent className="w-full max-w-md p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
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
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex justify-end gap-2 pt-4">
              {editingEventId && (
                <Button variant="destructive" onClick={handleDelete}>
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
  const colorMap: Record<string, string> = {
    work: '#FFFF00',      
    personal: '#22c55e', 
    urgent: '#ef4444',    
    other: '#ffff',   }

  const color = colorMap[eventInfo.event.extendedProps.category] || '#000'

  return (
    <div
      className="fc-custom-event bg-none flex items-center gap-1"
      style={{
        backgroundColor: 'transparent',
        color,
      }}
    >
      <div className='text-2xl'>{eventInfo.event.title}</div>/
      <div className='text-xs'>{eventInfo.timeText}</div>
    </div>
  )
}



