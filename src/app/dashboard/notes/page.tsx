'use client'

import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import NotesCard from "./NotesCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getAllNotesData } from "@/services/userService"
import useUserStore from "@/stores/useUserStore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Plus, 
  FileText, 
  Grid3X3,
  List,
  PenTool,
} from "lucide-react"
import { Component } from "@/components/loding"


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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  async function getnotes(id: string) {
    setIsLoading(true)
    try {
      const res = await getAllNotesData(id)
      setNotesData(res.notes)
      setFilteredNotes(res.notes)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userData?.id) {
      getnotes(userData.id)
    }
  }, [userData])

  useEffect(() => {
    const filtered = notesData.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredNotes(filtered)
  }, [searchQuery, notesData])

  function openNoteDialog(note: Note) {
    setSelectedNote(note)
    setOpen(true)
  }

  const handleNoteDelete = (deletedId: string) => {
    setNotesData(prev => prev.filter(note => note.id !== deletedId))
    setFilteredNotes(prev => prev.filter(note => note.id !== deletedId))
  }

  const stats = {
    total: notesData.length,
    thisWeek: notesData.filter(note => {
      if (!note.createdAt) return false
      const noteDate = new Date(note.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return noteDate >= weekAgo
    }).length,
    withImages: notesData.filter(note => note.imgData).length
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30">
      {/* Enhanced Header */}
      <SidebarInset>
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  My Notes
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.total} notes • {stats.thisWeek} this week
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              {/* Add Note Button */}
              <Link href="/tabs/draw">
                <Button className="h-10 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Add Note
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>
          </div>
        </header>
      </SidebarInset>


      {/* Notes Content */}
      <main className="px-6 pb-12">
        <AnimatePresence>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Component/>
              </motion.div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-96 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/30 dark:to-purple-950/30 rounded-full flex items-center justify-center mb-6">
                <PenTool className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                {searchQuery 
                  ? `No notes match "${searchQuery}". Try adjusting your search terms.`
                  : 'Start capturing your ideas and thoughts. Create your first note to get started!'
                }
              </p>
              {!searchQuery && (
                <Link href="/tabs/draw">
                  <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Create Your First Note
                  </Button>
                </Link>
              )}
            </motion.div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {filteredNotes.map((note, i) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  layout
                >
                  <NotesCard 
                    {...note} 
                    onClick={() => openNoteDialog(note)}
                    onDelete={handleNoteDelete}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Enhanced Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-6xl max-h-[90vh] p-0 overflow-y-auto rounded-3xl border-0 shadow-2xl bg-white dark:bg-gray-900">
          {/* Dialog Header */}
          <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-8 border-b border-gray-200 dark:border-gray-800">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white text-left">
                {selectedNote?.title || "Untitled Note"}
              </DialogTitle>
              {selectedNote?.description && (
                <DialogDescription className="text-lg text-gray-600 dark:text-gray-400 text-left leading-relaxed">
                  {selectedNote.description}
                </DialogDescription>
              )}
            </DialogHeader>
          </div>

          {/* Dialog Content */}
          <div className="p-8 overflow-auto">
            <div className="flex justify-center">
              {selectedNote?.imgData ? (
                <div className="relative max-w-full">
                  <img
                    src={selectedNote.imgData}
                    alt={selectedNote.title}
                    className="w-full max-h-[60vh] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                  <FileText className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No image available</p>
                  <p className="text-sm opacity-75">This note contains text content only</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
