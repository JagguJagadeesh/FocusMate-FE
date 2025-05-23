'use client'
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator";
import NotesCard from "./NotesCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllNotesData } from "@/services/userService";
import useUserStore from "@/stores/useUserStore";
import { Turret_Road } from "next/font/google";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

const caveat = Turret_Road({
  subsets: ['latin'],
  weight: "500"
})

type Note = {
  id: string;
  title: string;
  description: string;
  imgData: string;
  ownerID: string;
};

export default function Page() {
  const userData = useUserStore(s => s.user);
  const [notesData, setNotesData] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  async function getnotes(id: string) {
    const res = await getAllNotesData(id);
    setNotesData(res.notes);
  }

  useEffect(() => {
    if (userData?.id) {
      getnotes(userData.id);
    }
  }, [userData]);

  function openNoteDialog(note: Note) {
    setSelectedNote(note);
    setOpen(true);
  }

  return (
    <div className={caveat.className}>
      <SidebarInset className="">
        <header className="absolute flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
      </SidebarInset>
      <div className="flex h-20 z-10 items-center justify-around">
        <p className="text-3xl">My Notes</p>
      </div>
      <div className="absolute top-6 right-10">
        <Link href='/tabs/draw'>
          <Button className="cursor-pointer text-xl font-bold">
            Create Note
          </Button>
        </Link>
      </div>

      <div className={`${caveat.className} mt-10 ml-4 px-6`}>
        {notesData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-center text-muted-foreground text-lg">No notes found.</p>
          </div>
        ) : (
          <motion.div
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 },
              },
            }}
          >
            {notesData.map((item) => (
              <motion.div
                key={item.id}
                className="w-full min-w-[18rem] mx-auto cursor-pointer rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border bg-white dark:bg-zinc-900"
                onClick={() => openNoteDialog(item)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <NotesCard {...item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Dialog for selected note */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-3xl max-h-[90vh] p-6 overflow-auto rounded-2xl">
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
                className="max-w-full max-h-[500px] rounded-xl shadow-md border border-gray-300"
              />
            ) : (
              <p className="text-muted-foreground text-center">No image available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
