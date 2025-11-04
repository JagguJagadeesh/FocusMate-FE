'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { SearchIcon, BookOpen, Plus, Trash, Eye, Star, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import { addBook, deleteBook, getAllBooks } from '@/services/userService'
import useUserStore from '@/stores/useUserStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'

type BookType = {
  key: string
  title: string
  cover_i?: number
  author_name?: string[]
}

type UserBooksResponse = {
  books: string[]
}

export default function BookSearch() {
  const [searchInput, setSearchInput] = useState('')
  const [data, setData] = useState<BookType[]>([])
  const [list, setList] = useState<BookType[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUserStore()

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      toast.error("Enter a book title or author")
      return
    }
    try {
      setIsSearching(true)
      setDrawerOpen(true)
      const res = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchInput)}&limit=50`)
      setData(res.data.docs || [])
      if (!res.data.docs || res.data.docs.length === 0) {
        toast.info("No books found for this search")
      }
    } catch (err) {
      console.error('Search error:', err)
      toast.error("Failed to fetch books")
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    (async function fetchBooks() {
      try {
        setIsLoading(true)
        const res: UserBooksResponse = await getAllBooks({ id: user.id })
        const keys = res.books || []

        if (keys.length === 0) {
          setList([])
          return
        }

        const bookDetails = await Promise.all(
          keys.map(async (key) => {
            try {
              const r = await fetch(`https://openlibrary.org${key}.json`)
              const data = await r.json()
              return {
                key,
                title: data.title || 'Unknown Title',
                author_name: data.authors?.map((a: any) => a.name) || [],
                cover_i: data.covers ? data.covers[0] : undefined,
              }
            } catch {
              return null
            }
          })
        )

        setList(bookDetails.filter(Boolean) as BookType[])
      } catch (e) {
        console.error('Error fetching books:', e)
        toast.error("Error loading your books")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [user.id])

  const handleAddToList = async (book: BookType) => {
    if (list.find((b) => b.key === book.key)) {
      toast.info("Already in your collection")
      return
    }

    try {
      setList([...list, book])
      await addBook({ id: user.id, bookId: book.key })
      toast.success("Added to your collection! 📚")
    } catch (e) {
      console.error('Error adding book:', e)
      setList(list.filter((b) => b.key !== book.key))
      toast.error("Error adding book")
    }
  }

  const handleRemoveFromList = async (key: string) => {
    try {
      setList(list.filter((b) => b.key !== key))
      await deleteBook({ id: user.id, bookId: key })
      toast.success("Removed from collection")
    } catch (e) {
      console.error('Error deleting book:', e)
      toast.error("Error deleting book")
    }
  }

  return (
    <div className=" bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30 flex flex-col">
      {/* Header */}
      <SidebarInset>
        <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="flex h-14 items-center px-4 md:px-6 gap-2">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Books</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
      </SidebarInset>

      {/* Main Content - Fixed in section only */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <section className="flex-1 overflow-y-auto mt-4 px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto space-y-8"
          >
            {/* Hero Section */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
              >
                My Library
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl"
              >
                Discover and collect your favorite books from around the world.
              </motion.p>
            </div>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="flex flex-col sm:flex-row gap-3 max-w-3xl">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search for books, authors, genres..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 h-12 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="sm:w-auto"
                >
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg font-semibold transition-all duration-200 hover:shadow-xl"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <SearchIcon className="w-5 h-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Books Collection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-80">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  >
                    <BookOpen size={80} className="text-slate-300 dark:text-slate-700" />
                  </motion.div>
                </div>
              ) : list.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-80 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm"
                >
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  >
                    <BookOpen size={90} className="text-slate-300 dark:text-slate-700 mb-6" />
                  </motion.div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    Your collection is empty
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
                    Search for your favorite books and add them to start building your personal library
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Header with count */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between"
                  >
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                      Your Collection
                    </h2>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/40 dark:to-purple-950/40 border border-blue-200 dark:border-blue-800/50"
                    >
                      <Star className="w-5 h-5 text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400" />
                      <span className="text-sm font-bold text-blue-900 dark:text-blue-300">
                        {list.length} {list.length === 1 ? 'Book' : 'Books'}
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* Books Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                      {list.map((book, i) => (
                        <motion.div
                          key={book.key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                          layout
                          whileHover={{ y: -12 }}
                          className="group"
                        >
                          <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col h-full hover:border-blue-300 dark:hover:border-blue-700">
                            {/* Accent Line */}
                            <motion.div
                              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"
                              initial={{ width: 0 }}
                              whileHover={{ width: '100%' }}
                              transition={{ duration: 0.4 }}
                            />

                            {/* Image */}
                            <div className="relative h-60 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                              {book.cover_i ? (
                                <motion.img
                                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                                  alt={book.title}
                                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full">
                                  <BookOpen size={60} className="text-slate-400 dark:text-slate-600" />
                                </div>
                              )}
                              {/* Overlay */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1">
                              <motion.h3
                                className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug"
                                whileHover={{ x: 2 }}
                              >
                                {book.title}
                              </motion.h3>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 flex-1">
                                {book.author_name?.join(', ') || 'Unknown Author'}
                              </p>

                              {/* Actions */}
                              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <motion.div
                                  className="flex-1"
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                >
                                  <Button
                                    onClick={() => handleRemoveFromList(book.key)}
                                    size="sm"
                                    className="w-full h-9 bg-red-500/10 hover:bg-red-500/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg font-medium transition-all"
                                  >
                                    <Trash size={14} className="mr-1" />
                                    Remove
                                  </Button>
                                </motion.div>
                                <motion.div
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                >
                                  <Button
                                    size="sm"
                                    className="h-9 w-9 p-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm"
                                  >
                                    <Eye size={14} />
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Search Results Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="fixed bottom-0 left-0 right-0 max-h-[90vh] rounded-t-3xl border-0 shadow-2xl bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 p-6"
          >
            <DrawerHeader className="p-0 space-y-2">
              <DrawerTitle className="text-3xl font-bold text-slate-900 dark:text-white">
                Search Results
              </DrawerTitle>
              <DrawerDescription className="text-base text-slate-600 dark:text-slate-400">
                Found results for <span className="font-bold text-blue-600 dark:text-blue-400">&quot;{searchInput}&quot;</span>
              </DrawerDescription>
            </DrawerHeader>
          </motion.div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <AnimatePresence>
                {isSearching ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-64"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    >
                      <Loader2 size={50} className="text-blue-600 dark:text-blue-400" />
                    </motion.div>
                  </motion.div>
                ) : data.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {data.map((item, i) => (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: i * 0.03, duration: 0.3 }}
                        whileHover={{ y: -8 }}
                        className="group"
                      >
                        <div className="relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                          {/* Cover */}
                          <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                            {item.cover_i ? (
                              <motion.img
                                src={`https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full">
                                <BookOpen size={45} className="text-slate-400 dark:text-slate-600" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 flex-1 mb-3">
                              {item.author_name?.join(', ') || 'Unknown Author'}
                            </p>

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={() => handleAddToList(item)}
                                className="w-full h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm hover:shadow-md"
                              >
                                <Plus size={14} className="mr-1" />
                                Add
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-64"
                  >
                    <BookOpen size={70} className="text-slate-300 dark:text-slate-700 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">No books found</p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Try a different search term</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
