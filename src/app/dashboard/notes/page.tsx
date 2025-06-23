'use client'

import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import NotesCard from "./NotesCard"
import { Button } from "@/components/ui/button"
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
import { motion } from "framer-motion"

type Note = {
  id: string
  title: string
  description: string
  imgData: string
  ownerID: string
}

export default function Page() {
  const userData = useUserStore(s => s.user)
  const [notesData, setNotesData] = useState<Note[]>([])
  const [open, setOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  async function getnotes(id: string) {
    const res = await getAllNotesData(id)
    setNotesData(res.notes)
  }

  useEffect(() => {
    if (userData?.id) {
      getnotes(userData.id)
    }
  }, [userData])

  function openNoteDialog(note: Note) {
    setSelectedNote(note)
    setOpen(true)
  }

  return (
    <div className="w-full">
      {/* Sidebar + Header */}
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between px-4 border-b bg-background/80 backdrop-blur">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <h2 className="text-xl font-semibold">{userData.name}&apos;s Notes</h2>
          </div>
          <Link href="/tabs/draw">
            <Button className="text-sm sm:text-base px-4 py-2 shadow hover:scale-105 transition-all">
              + Add Note
            </Button>
          </Link>
        </header>
      </SidebarInset>

      {/* Notes Grid */}
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notesData.length === 0 ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <p className="text-center text-muted-foreground text-lg">No notes found.</p>
          </div>
        ) : (
          <>
            {notesData.map((note, i) => (
              <motion.div
                key={note.id}
                className="cursor-pointer rounded-lg bg-white dark:bg-zinc-900 border shadow-sm hover:shadow-md transition-all"
                onClick={() => openNoteDialog(note)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NotesCard {...note} />
              </motion.div>
            ))}
          </>
        )}
      </main>

      {/* Dialog for Selected Note */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-5xl p-6 overflow-auto rounded-2xl">
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-2xl font-bold text-center">
              {selectedNote?.title || "Untitled Note"}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground text-center">
              {selectedNote?.description || "No description provided."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center">
            {selectedNote?.imgData ? (
              <img
                src={selectedNote.imgData}
                alt={selectedNote.title}
                className="w-full max-h-[500px] rounded-xl shadow-md border border-gray-300 object-contain"
              />
            ) : (
              <p className="text-muted-foreground text-center">No image available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
