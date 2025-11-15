'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Calendar as CalendarIcon, Search, Grid3X3, List, Plus } from 'lucide-react'
import { getAllEvents } from '@/services/userService'
import Link from 'next/link'
import EventCard from './EventCard'
import { Component } from '@/components/Loaders/loding'

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b">
          <div className="flex h-14 sm:h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="font-bold text-lg sm:text-xl">Events</h1>
            </div>
            <Link href="events/organize">
              <Button size="sm" className="rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Create Event</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </Link>
          </div>
        </header>
      </SidebarInset>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-40 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-36 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                size="sm"
                className="rounded-md"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                size="sm"
                className="rounded-md"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Component />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div
            className={`grid gap-4 sm:gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 max-w-3xl mx-auto'
              }`}
          >
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} formatDate={formatDate} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
