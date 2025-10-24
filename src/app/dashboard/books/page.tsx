'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { SearchIcon, BookOpen, Plus, Book, Trash, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import { addBook, deleteBook, getAllBooks } from '@/services/userService'
import useUserStore from '@/stores/useUserStore'

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


  const { user } = useUserStore();

  const handleSearch = async () => {
    if (!searchInput.trim()) return
    try {
      setDrawerOpen(true)
      const res = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchInput)}`)
      setData(res.data.docs)
    } catch (err) {
      console.error('Search error:', err)
      toast.error("Failed to fetch data")
    }
  }

  useEffect(() => {
    (async function fetchBooks() {
      try {
        const res: UserBooksResponse = await getAllBooks({ id: user.id })
        const keys = res.books || []

        // Fetch book details in parallel
        const bookDetails = await Promise.all(
          keys.map(async (key) => {
            const r = await fetch(`https://openlibrary.org${key}.json`)
            const data = await r.json()
            return {
              key,
              title: data.title,
              author_name: data.authors?.map((a: any) => a.name) || [],
              cover_i: data.covers ? data.covers[0] : undefined,
            }
          })
        )

        setList(bookDetails)
      } catch (e) {
        toast.error("Error fetching books")
      }
    })()
  }, [user.id])


  const handleAddToList = async (book: BookType) => {
    if (!list.find((b) => b.key === book.key)) {
      try {
        setList([...list, book])
        await addBook({ id: user.id, bookId: book.key })
        toast.success("Book added to your list")
      } catch (e) {
        toast.error("Error adding book")
      }
    } else {
      toast.info("Already in list")
    }
  }

  const handleRemoveFromList = async (key: string) => {
    try {
      setList(list.filter((b) => b.key !== key))
      await deleteBook({ id: user.id, bookId: key })
      toast.success("Removed from list")
    } catch (e) {
      toast.error("Error deleting book")
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <SidebarInset>
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-300 dark:border-gray-800 shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-700 to-blue-500 dark:from-violet-300 dark:to-blue-400 bg-clip-text text-transparent">
                Book Explorer
              </h1>
            </div>
          </div>
        </header>
      </SidebarInset>

      <main className="flex-1 px-6 py-10 flex flex-col items-center">
        {/* Search Input Section */}
        <div className="w-full max-w-2xl mb-10 flex gap-3">
          <InputGroup className="flex-1">
            <InputGroupInput
              placeholder="Search for books..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <Button onClick={handleSearch} className="px-6 bg-violet-600 hover:bg-violet-700 shadow-md hover:shadow-lg transition">
            Search
          </Button>
        </div>

        {/* Added Books Grid */}
        <section className="w-full max-w-6xl">
          {list.length === 0 ? (
            <div className="w-full h-96 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
              <Book size={70} className="text-gray-500 dark:text-gray-400" />
              <p className="mt-5 text-xl font-medium text-gray-600 dark:text-gray-400">Search and add your favorite books.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Collection</h3>
                <span className="text-sm text-violet-600 dark:text-violet-400">
                  {list.length} {list.length === 1 ? 'Book' : 'Books'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[480px] overflow-y-auto">
                {list.map((book) => (
                  <div
                    key={book.key}
                    className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden bg-white dark:bg-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    {book.cover_i ? (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                        alt={book.title}
                        className="w-full h-56 object-full"
                      />
                    ) : (
                      <div className="w-full h-56 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <BookOpen size={40} className="text-gray-500" />
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-sm font-semibold line-clamp-2 text-gray-900 dark:text-gray-100">{book.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
                      </p>
                      <div className="flex gap-2 mt-auto pt-4">
                        <Button
                          onClick={() => handleRemoveFromList(book.key)}
                          size="sm"
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3"
                        >
                          <Trash size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white px-3"
                        >
                          <Eye size={14} /> Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Drawer for Search Results */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-300 dark:border-gray-700">
          <div className="max-w-6xl mx-auto flex flex-col h-full p-5">
            <DrawerHeader>
              <DrawerTitle className="text-lg mb-1 text-gray-800 dark:text-gray-200">Search Results</DrawerTitle>
              <DrawerDescription>
                Showing results for <span className="text-violet-600">&quot;{searchInput}&quot;</span>
              </DrawerDescription>
            </DrawerHeader>

            <div className="h-[65vh] overflow-y-auto mt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {data.length > 0 ? (
                  data.map((item) => (
                    <div
                      key={item.key}
                      className="relative group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
                    >
                      <div className="h-48 overflow-hidden rounded-t-xl">
                        {item.cover_i ? (
                          <img
                            src={`https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">
                            <BookOpen size={40} />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold line-clamp-2 mb-1">{item.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {item.author_name ? item.author_name.join(', ') : 'Unknown Author'}
                        </p>
                        <Button
                          onClick={() => handleAddToList(item)}
                          className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm mt-2"
                        >
                          <Plus size={14} /> Add to List
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No books found...</p>
                )}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
