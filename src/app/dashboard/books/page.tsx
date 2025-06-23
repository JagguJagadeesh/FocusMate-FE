'use client'

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { BookOpen } from 'lucide-react'

const sampleBooks = [
  { title: 'Atomic Habits', author: 'James Clear' },
  { title: 'Deep Work', author: 'Cal Newport' },
  { title: 'Clean Code', author: 'Robert C. Martin' },
]

export default function MyBooksPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 items-center gap-2 px-4 border-b bg-background/80 backdrop-blur">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> My Books
        </h2>
      </header>

      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sampleBooks.map((book, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white dark:bg-zinc-900 p-4 shadow hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-bold">{book.title}</h3>
            <p className="text-sm text-muted-foreground">by {book.author}</p>
          </div>
        ))}
      </main>
    </SidebarInset>
  )
}
