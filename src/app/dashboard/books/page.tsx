'use client'

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Search, 
  Plus, 
  Filter,
  Star,
  Target,
  Calendar,
  Grid3X3,
  List,
  Eye,
  BookMarked,
  Award,
  BarChart3,
} from 'lucide-react'
import { useState } from 'react'

const sampleBooks = [
  { 
    id: 1,
    title: 'Atomic Habits', 
    author: 'James Clear',
    category: 'Self-Help',
    status: 'completed',
    rating: 5,
    progress: 100,
    pages: 320,
    dateAdded: '2024-01-15',
    cover: '/api/placeholder/120/180',
    notes: 'Great book about building good habits and breaking bad ones.'
  },
  { 
    id: 2,
    title: 'Deep Work', 
    author: 'Cal Newport',
    category: 'Productivity',
    status: 'reading',
    rating: 4,
    progress: 65,
    pages: 296,
    dateAdded: '2024-01-20',
    cover: '/api/placeholder/120/180',
    notes: 'Essential read for focus and productivity.'
  },
  { 
    id: 3,
    title: 'Clean Code', 
    author: 'Robert C. Martin',
    category: 'Technology',
    status: 'reading',
    rating: 0,
    progress: 30,
    pages: 464,
    dateAdded: '2024-02-01',
    cover: '/api/placeholder/120/180',
    notes: ''
  },
  { 
    id: 4,
    title: 'The Psychology of Money', 
    author: 'Morgan Housel',
    category: 'Finance',
    status: 'want-to-read',
    rating: 0,
    progress: 0,
    pages: 256,
    dateAdded: '2024-02-10',
    cover: '/api/placeholder/120/180',
    notes: ''
  },
  { 
    id: 5,
    title: 'Mindset', 
    author: 'Carol S. Dweck',
    category: 'Psychology',
    status: 'completed',
    rating: 5,
    progress: 100,
    pages: 276,
    dateAdded: '2024-01-05',
    cover: '/api/placeholder/120/180',
    notes: 'Powerful insights about growth vs fixed mindset.'
  },
]

const categories = ['All', 'Self-Help', 'Productivity', 'Technology', 'Finance', 'Psychology']
const statusOptions = [
  { value: 'all', label: 'All Books' },
  { value: 'reading', label: 'Currently Reading' },
  { value: 'completed', label: 'Completed' },
  { value: 'want-to-read', label: 'Want to Read' }
]

const statusConfig = {
  reading: { label: 'Reading', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  'want-to-read': { label: 'Want to Read', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' }
}

export default function MyBooksPage() {
  const [books, setBooks] = useState(sampleBooks)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [addBookOpen, setAddBookOpen] = useState(false)

  // Filter books based on search, category, and status
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || book.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Calculate statistics
  const stats = {
    total: books.length,
    completed: books.filter(b => b.status === 'completed').length,
    reading: books.filter(b => b.status === 'reading').length,
    wantToRead: books.filter(b => b.status === 'want-to-read').length,
    totalPages: books.filter(b => b.status === 'completed').reduce((sum, book) => sum + book.pages, 0),
    avgRating: books.filter(b => b.rating > 0).reduce((sum, book, _, arr) => sum + book.rating / arr.length, 0)
  }
  

  const handleAddBook = (bookData) => {
    const newBook = {
      id: books.length + 1,
      ...bookData,
      dateAdded: new Date().toISOString().split('T')[0],
      progress: bookData.status === 'completed' ? 100 : 0
    }
    setBooks([...books, newBook])
    setAddBookOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30">
      {/* Enhanced Header */}
      <SidebarInset>
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  My Library
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.total} books • {stats.completed} completed
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* View Toggle */}
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

              {/* Add Book Button */}
              <Dialog open={addBookOpen} onOpenChange={setAddBookOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                    <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Add Book
                  </Button>
                </DialogTrigger>
                <AddBookDialog onAddBook={handleAddBook} />
              </Dialog>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>
          </div>
        </header>
      </SidebarInset>

      {/* Stats Overview */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total Books",
              value: stats.total,
              icon: <BookOpen className="w-5 h-5" />,
              color: "from-purple-500 to-pink-500"
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: <Award className="w-5 h-5" />,
              color: "from-green-500 to-emerald-500"
            },
            {
              label: "Currently Reading",
              value: stats.reading,
              icon: <Eye className="w-5 h-5" />,
              color: "from-blue-500 to-cyan-500"
            },
            {
              label: "Want to Read",
              value: stats.wantToRead,
              icon: <Target className="w-5 h-5" />,
              color: "from-orange-500 to-red-500"
            },
            {
              label: "Pages Read",
              value: stats.totalPages.toLocaleString(),
              icon: <BarChart3 className="w-5 h-5" />,
              color: "from-indigo-500 to-purple-500"
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
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
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40 h-9 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48 h-9 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Books Grid/List */}
      <main className="px-6 pb-12">
        <AnimatePresence>
          {filteredBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-96 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'No books found' : 'Start building your library'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                {searchQuery 
                  ? `No books match "${searchQuery}". Try adjusting your search terms.`
                  : 'Add your first book to start tracking your reading journey!'
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setAddBookOpen(true)}
                  className="h-12 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Add Your First Book
                </Button>
              )}
            </motion.div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {filteredBooks.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  layout
                >
                  <BookCard book={book} viewMode={viewMode} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

// Book Card Component
function BookCard({ book, viewMode }) {
  return (
    <div className={`group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1 ${
      viewMode === 'list' ? 'flex items-center p-6 gap-6' : 'p-6'
    }`}>
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-pink-50/0 to-blue-50/0 dark:from-purple-950/0 dark:via-pink-950/0 dark:to-blue-950/0 group-hover:from-purple-50/30 group-hover:via-pink-50/20 group-hover:to-blue-50/30 dark:group-hover:from-purple-950/20 dark:group-hover:via-pink-950/10 dark:group-hover:to-blue-950/20 transition-all duration-500 pointer-events-none" />
      
      <div className={`relative z-10 ${viewMode === 'list' ? 'flex items-center gap-6 w-full' : ''}`}>
        {/* Book Cover */}
        <div className={`relative ${viewMode === 'list' ? 'w-16 h-24 flex-shrink-0' : 'w-full h-48 mb-4'} bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
          {/* Progress Overlay for Reading Books */}
          {book.status === 'reading' && book.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${book.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
              <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 ${
                viewMode === 'list' ? 'text-lg mb-1' : 'text-lg mb-2 line-clamp-2'
              }`}>
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                by {book.author}
              </p>
              
              {/* Category & Status */}
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {book.category}
                </Badge>
                <Badge className={`text-xs ${statusConfig[book.status].color}`}>
                  {statusConfig[book.status].label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Progress & Rating */}
          <div className={`space-y-2 ${viewMode === 'list' ? 'min-w-0 flex-1' : ''}`}>
            {book.status === 'reading' && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <BarChart3 className="w-4 h-4" />
                <span>{book.progress}% complete</span>
              </div>
            )}
            
            {book.rating > 0 && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < book.rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`} 
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <BookMarked className="w-3 h-3" />
                <span>{book.pages} pages</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Added {new Date(book.dateAdded).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </div>
  )
}

// Add Book Dialog Component
function AddBookDialog({ onAddBook }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Self-Help',
    status: 'want-to-read',
    pages: '',
    notes: '',
    rating: 0
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title && formData.author) {
      onAddBook({
        ...formData,
        pages: parseInt(formData.pages) || 0
      })
      setFormData({
        title: '',
        author: '',
        category: 'Self-Help',
        status: 'want-to-read',
        pages: '',
        notes: '',
        rating: 0
      })
    }
  }

  return (
    <DialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Add New Book</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter book title"
              className="h-10 rounded-lg"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              placeholder="Enter author name"
              className="h-10 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="h-10 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== 'All').map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger className="h-10 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.filter(s => s.value !== 'all').map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="pages">Pages</Label>
            <Input
              id="pages"
              type="number"
              value={formData.pages}
              onChange={(e) => setFormData({...formData, pages: e.target.value})}
              placeholder="Number of pages"
              className="h-10 rounded-lg"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Add your notes about this book..."
              className="min-h-[80px] rounded-lg resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" className="rounded-lg">
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
