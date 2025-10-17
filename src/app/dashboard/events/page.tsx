'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Calendar as CalendarIcon, Search, Grid3X3, List, LoaderCircle } from 'lucide-react'
import { getAllEvents } from '@/services/userService'
import Link from 'next/link'
import EventCard from './EventCard'
import DashboardLoading from '@/components/Loaders/loading'
import TypingLoader from '@/components/Loaders/TypingLoader'

const categories = ['All', 'Coding', 'Conference', 'Workshop', 'Business']
const eventTypes = ['All', 'Virtual', 'In-Person', 'Hybrid']
type EventType = {
  id: string
  title: string
  desc: string
  date: string
  location: string
  type: 'Virtual' | 'InPerson'
  category: string
  price: number
  capacity: number
  registered: number
  image?: string
  tags?: string[]
  difficulty: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
  (async () => {
    const data = await getAllEvents()
    setEvents(data.events as EventType[])
    setLoading(false)
  })()
}, [])

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.desc.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory
    const matchesType = selectedType === 'All' || event.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarInset>
        <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-30 backdrop-blur-xl bg-white/60 dark:bg-gray-950/60 border-b border-gray-200/40 dark:border-gray-700/50 shadow-[0_2px_16px_rgba(136,84,208,0.08)]"
    >
      <div className="flex h-16 items-center justify-between mx-auto max-w-7xl px-6">
        {/* Left: Sidebar button & Logo */}
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div className="flex items-center gap-1">
            {/* <Sparkles className="w-5 h-5 text-purple-500" /> */}
            <h1 className="font-semibold text-lg sm:text-xl">
              FocusMate Events
            </h1>
          </div>
        </div>

        {/* Right: Button */}
        <Link href={'events/organize'}
          className="rounded px-4 py-2 text-sm sm:text-base font-medium bg-gradient-to-r 
                     from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 
                     text-white shadow-md hover:shadow-lg transition-all duration-300
                     flex items-center gap-2"
        >
          Organize Event
        </Link>
      </div>
    </motion.header>
      </SidebarInset>

      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-4 lg:flex-row items-center justify-between">
        <div className="relative w-full lg:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-gray-500" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-lg h-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
        <div className="flex gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-36 h-10 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32 h-10 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} onClick={() => setViewMode('grid')} size="sm">
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')} size="sm">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Event List */}
      <div className={`grid gap-6 px-6 pb-16 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
        <AnimatePresence>
          {loading ? (
            <TypingLoader/>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <CalendarIcon className="mx-auto w-10 h-10 mb-4 text-purple-500" />
              <p>No events found</p>
            </div>
          ) : (
            filteredEvents.map(event => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
              >
                <EventCard event={event} formatDate={formatDate} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

