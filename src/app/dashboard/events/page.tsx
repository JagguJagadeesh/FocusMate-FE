'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar as CalendarIcon,
  Search,
  MapPin,
  Clock,
  Users,
  Star,
  Bookmark,
  BookmarkCheck,
  Grid3X3,
  List,
  Ticket,
  Globe,
  Building,
  Zap,
  TrendingUp,
  Share2
} from 'lucide-react'

const upcomingEvents = [
  {
    id: 1,
    title: "Hackathon 2025",
    date: "July 10, 2025",
    time: "09:00 AM",
    location: "Online",
    type: "Virtual",
    category: "Coding",
    desc: "A 24-hour coding challenge to build real-world apps that solve everyday problems. Join developers worldwide!",
    price: "Free",
    capacity: 500,
    registered: 234,
    featured: true,
    image: "/api/placeholder/400/200",
    organizer: "TechCorp",
    tags: ["Programming", "Competition", "24hrs"],
    difficulty: "Intermediate"
  },
  {
    id: 2,
    title: "Dev Conference 2025",
    date: "Aug 15, 2025",
    time: "10:00 AM",
    location: "Bangalore",
    type: "In-Person",
    category: "Conference",
    desc: "Talks, workshops, and networking with tech enthusiasts. Learn from industry leaders and connect with peers.",
    price: "₹2,500",
    capacity: 300,
    registered: 187,
    featured: false,
    image: "/api/placeholder/400/200",
    organizer: "DevCommunity",
    tags: ["Networking", "Workshops", "Talks"],
    difficulty: "All Levels"
  },
  {
    id: 3,
    title: "AI Workshop Series",
    date: "Sep 5, 2025",
    time: "02:00 PM",
    location: "Mumbai",
    type: "Hybrid",
    category: "Workshop",
    desc: "Hands-on workshop series covering machine learning fundamentals and practical AI applications.",
    price: "₹1,500",
    capacity: 150,
    registered: 89,
    featured: true,
    image: "/api/placeholder/400/200",
    organizer: "AI Academy",
    tags: ["AI", "Machine Learning", "Hands-on"],
    difficulty: "Beginner"
  },
  {
    id: 4,
    title: "Startup Pitch Day",
    date: "Oct 12, 2025",
    time: "11:00 AM",
    location: "Delhi",
    type: "In-Person",
    category: "Business",
    desc: "Present your startup ideas to investors and industry experts. Great opportunity for funding and mentorship.",
    price: "₹500",
    capacity: 200,
    registered: 156,
    featured: false,
    image: "/api/placeholder/400/200",
    organizer: "StartupHub",
    tags: ["Entrepreneurship", "Pitching", "Investment"],
    difficulty: "All Levels"
  }
]

const categories = ['All', 'Coding', 'Conference', 'Workshop', 'Business']
const eventTypes = ['All', 'Virtual', 'In-Person', 'Hybrid']

const categoryConfig = {
  Coding: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: <Zap className="w-3 h-3" /> },
  Conference: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: <Users className="w-3 h-3" /> },
  Workshop: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: <BookmarkCheck className="w-3 h-3" /> },
  Business: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: <TrendingUp className="w-3 h-3" /> }
}

const typeConfig = {
  Virtual: { color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400', icon: <Globe className="w-3 h-3" /> },
  'In-Person': { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: <Building className="w-3 h-3" /> },
  Hybrid: { color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400', icon: <Zap className="w-3 h-3" /> }
}

function Event() {
  const [events, setEvents] = useState(upcomingEvents)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [bookmarkedEvents, setBookmarkedEvents] = useState<number[]>([])

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory
    const matchesType = selectedType === 'All' || event.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  // Calculate statistics
  const stats = {
    total: events.length,
    featured: events.filter(e => e.featured).length,
    registered: events.reduce((sum, event) => sum + event.registered, 0),
    upcoming: events.filter(e => new Date(e.date) > new Date()).length
  }

  const handleBookmark = (eventId: number) => {
    setBookmarkedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50/50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30">
      <div className="w-full max-w-7xl mx-auto px-4 py-16 space-y-12">

        {/* Header Section */}
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full text-sm font-medium text-purple-700 dark:text-purple-300 mb-6">
            <CalendarIcon className="w-4 h-4" />
            Discover Amazing Events
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 dark:from-white dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent">
            Upcoming{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Events
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest tech events, workshops, and conferences.
            Connect with like-minded professionals and expand your knowledge.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="flex flex-col lg:flex-row gap-4 items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-80 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32 h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            {
              label: "Total Events",
              value: stats.total,
              icon: <CalendarIcon className="w-5 h-5" />,
              color: "from-purple-500 to-pink-500"
            },
            {
              label: "Featured Events",
              value: stats.featured,
              icon: <Star className="w-5 h-5" />,
              color: "from-blue-500 to-cyan-500"
            },
            {
              label: "Total Registrations",
              value: stats.registered,
              icon: <Users className="w-5 h-5" />,
              color: "from-green-500 to-emerald-500"
            },
            {
              label: "This Month",
              value: stats.upcoming,
              icon: <Clock className="w-5 h-5" />,
              color: "from-orange-500 to-red-500"
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Events Grid/List */}
        <AnimatePresence>
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-96 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 rounded-full flex items-center justify-center mb-6">
                <CalendarIcon className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                {searchQuery
                  ? `No events match "${searchQuery}". Try adjusting your search terms.`
                  : 'No events match your current filters. Try adjusting the filters above.'
                }
              </p>
            </motion.div>
          ) : (
            <div className={`grid gap-8 ${viewMode === 'grid'
                ? 'grid-cols-1 lg:grid-cols-2'
                : 'grid-cols-1 max-w-4xl mx-auto'
              }`}>
              {filteredEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  layout
                >
                  <EventCard
                    event={event}
                    viewMode={viewMode}
                    isBookmarked={bookmarkedEvents.includes(event.id)}
                    onBookmark={() => handleBookmark(event.id)}
                    formatDate={formatDate}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Event Card Component
function EventCard({ event, viewMode, isBookmarked, onBookmark, formatDate }) {
  const progressPercentage = (event.registered / event.capacity) * 100

  return (
    <div className={`group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 ${viewMode === 'list' ? 'flex items-center gap-6 p-6' : 'p-0'
      }`}>
      {/* Featured Badge */}
      {event.featured && (
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs font-semibold">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      {/* Bookmark Button */}
      <button
        onClick={onBookmark}
        className="absolute top-4 right-4 z-20 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-300 group/bookmark"
      >
        {isBookmarked ? (
          <BookmarkCheck className="w-4 h-4 text-purple-600" />
        ) : (
          <Bookmark className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/bookmark:text-purple-600 transition-colors" />
        )}
      </button>

      {/* Event Image */}
      {viewMode === 'grid' && (
        <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <CalendarIcon className="w-16 h-16 text-purple-400 opacity-50" />
          </div>
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
        </div>
      )}

      {/* Event Content */}
      <div className={`${viewMode === 'grid' ? 'p-6' : 'flex-1'}`}>
        <div className="space-y-4">
          {/* Event Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 ${viewMode === 'list' ? 'text-xl' : 'text-xl line-clamp-2'
                }`}>
                {event.title}
              </h3>
            </div>

            {/* Event Meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            </div>

            {/* Event Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`text-xs ${categoryConfig[event.category]?.color || 'bg-gray-100 text-gray-800'}`}>
                {categoryConfig[event.category]?.icon}
                <span className="ml-1">{event.category}</span>
              </Badge>
              <Badge className={`text-xs ${typeConfig[event.type]?.color || 'bg-gray-100 text-gray-800'}`}>
                {typeConfig[event.type]?.icon}
                <span className="ml-1">{event.type}</span>
              </Badge>
              <Badge variant="outline" className="text-xs">
                {event.difficulty}
              </Badge>
            </div>
          </div>

          {/* Event Description */}
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
            {event.desc}
          </p>

          {/* Event Tags */}
          <div className="flex flex-wrap gap-1">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-lg">
                #{tag}
              </span>
            ))}
          </div>

          {/* Registration Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 inline mr-1" />
                {event.registered}/{event.capacity} registered
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.round(progressPercentage)}% full
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Event Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Organized by {event.organizer}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {event.price}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group/register"
              >
                <Ticket className="w-4 h-4 mr-2 group-hover/register:rotate-12 transition-transform" />
                Register
              </Button>
            </div>
          </div>
        </div>
      </div>    </div>
  )
}

export default Event
