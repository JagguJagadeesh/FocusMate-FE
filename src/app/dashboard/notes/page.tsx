'use client'

import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import NotesCard from "./NotesCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getAllNotesData } from "@/services/userService"
import useUserStore from "@/stores/useUserStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, FileText, PenTool, Calendar, Clock } from "lucide-react"
import { Component } from "@/components/Loaders/loding"

type Note = {
  id: string
  title: string
  description: string
  imgData: string
  ownerID: string
  createdAt?: string
}

export default function Page() {
  const userData = useUserStore(s => s.user)
  const [notesData, setNotesData] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [open, setOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  async function getnotes(id: string) {
    setIsLoading(true)
    try {
      const res = await getAllNotesData(id)
      const sorted = [...(res.notes || [])].sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      )
      setNotesData(sorted)
      setFilteredNotes(sorted)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userData?.id) getnotes(userData.id)
  }, [userData])

  useEffect(() => {
    const filtered = notesData.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredNotes(filtered)
  }, [searchQuery, notesData])

  const handleNoteDelete = (deletedId: string) => {
    setNotesData(prev => prev.filter(note => note.id !== deletedId))
    setFilteredNotes(prev => prev.filter(note => note.id !== deletedId))
  }

  const groupByDate = (notes: Note[]) => {
    const groups: { [key: string]: Note[] } = {}
    notes.forEach(note => {
      const date = new Date(note.createdAt || new Date())
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let key: string
      if (date.toDateString() === today.toDateString()) {
        key = 'Today'
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday'
      } else {
        key = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      }

      if (!groups[key]) groups[key] = []
      groups[key].push(note)
    })
    return groups
  }

  const groupedNotes = groupByDate(filteredNotes)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30">
      {/* Header */}
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md transition-all">
          <div className="flex items-center gap-2 px-4 md:px-6 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Notes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-56 h-9 text-sm rounded-lg border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Link href="/tabs/draw">
                <Button className="h-9 px-4 rounded-lg shadow-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>
      </SidebarInset>

      {/* Main */}
      <main className="p-4 mt-2 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="space-y-2">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                My Notes
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {notesData.length} {notesData.length === 1 ? 'note' : 'notes'} • Organize your thoughts
              </p>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full rounded-lg"
              />
            </div>
          </div>

          {/* Timeline Content */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-96"
              >
                <Component />
              </motion.div>
            ) : filteredNotes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <PenTool className="w-20 h-20 text-gray-300 dark:text-gray-700 mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No notes found' : 'No notes yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
                  {searchQuery 
                    ? `Try a different search term for "${searchQuery}"`
                    : 'Start creating notes to organize your thoughts and ideas'
                  }
                </p>
                {!searchQuery && (
                  <Link href="/tabs/draw">
                    <Button className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Note
                    </Button>
                  </Link>
                )}
              </motion.div>
            ) : (
              <div className="space-y-10">
                {Object.entries(groupedNotes).map(([date, notes], groupIndex) => (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1 }}
                    className="space-y-4"
                  >
                    {/* Date Header */}
                    <div className="flex items-center gap-4 sticky top-14 z-10 bg-gradient-to-r from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent backdrop-blur-sm py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/40">
                          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
                          {date}
                        </h2>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700 dark:to-transparent" />
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                      </span>
                    </div>

                    {/* Notes List */}
                    <div className="space-y-3 h-[23rem] overflow-auto">
                      {notes.map((note, i) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          layout
                        >
                          <NotesCard 
                            {...note} 
                            onClick={() => {
                              setSelectedNote(note)
                              setOpen(true)
                            }}
                            onDelete={handleNoteDelete}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 rounded-2xl border-0 shadow-2xl overflow-hidden max-h-[90vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 p-6 border-b border-gray-200 dark:border-gray-800">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedNote?.title}
                </DialogTitle>
                {selectedNote?.description && (
                  <DialogDescription className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedNote.description}
                  </DialogDescription>
                )}
              </DialogHeader>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center bg-white dark:bg-gray-950">
              {selectedNote?.imgData ? (
                <motion.img
                  src={selectedNote.imgData}
                  alt={selectedNote.title}
                  className="max-w-full max-h-full rounded-xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                />
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-900 mx-auto">
                    <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">No image available</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This note contains text only</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
