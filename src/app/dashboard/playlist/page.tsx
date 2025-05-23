'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import { Turret_Road } from 'next/font/google'
import { Input } from '@/components/ui/input'

const caveat = Turret_Road({
  subsets: ['latin'],
  weight: '500'
})

export default function PlayList() {
  const [data, setData] = useState([
    {
      url: "https://www.youtube.com/embed/vsBpWgNYjtQ?si=eB1uSV-pf-TMa09d",
      title: "ShadCN UI Overview",
    },
    {
      url: "https://www.youtube.com/embed/dr0eARKwQ_0",
      title: "Next.js App Routing",
    },
    {
      url: "https://www.youtube.com/embed/xyyejJYeILM?list=PLpyc33gOcbVBvdfzlSn97a1TlfysSPwm-",
      title: "Tailwind Tips & Tricks",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleOpen = (video: { url: string; title: string }) => {
    setActiveVideo(video);
    setOpen(true);
  };

  const handleAddVideo = () => {
    if (!newTitle || !newUrl) return;

    const embedUrl = newUrl.includes('embed') ? newUrl : newUrl.replace("watch?v=", "embed/");
    const newVideo = { title: newTitle, url: embedUrl };

    console.log("New Video:", newVideo);
    setData(prev => [...prev, newVideo]);
    setNewTitle('');
    setNewUrl('');
    setOpenAddDialog(false);
  };

  return (
    <div className={caveat.className}>
      <SidebarInset>
        <header className="absolute flex h-16 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
      </SidebarInset>

      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl mb-6 text-center">My Playlist</h2>
        <Button
          className='fixed bottom-6 right-6 text-lg flex gap-2 items-center'
          onClick={() => setOpenAddDialog(true)}
        >
          Add <Plus size={24} />
        </Button>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleOpen(video)}
              className="cursor-pointer"
            >
              <div className='w-full h-full p-4 border rounded-lg bg-white dark:bg-zinc-900'>
                <div className="aspect-video rounded-2xl border overflow-hidden">
                  <iframe
                    src={video.url}
                    className="w-full h-full pointer-events-none"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
                <div className='flex items-center justify-between mt-4'>
                  <p className='text-sm font-medium'>{video.title}</p>
                  <Button className='bg-red-600 hover:bg-red-500 cursor-pointer'>
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dialog for playing video */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-[52rem] min-h-[28rem] p-6">
          <DialogHeader className="px-6 pt-4">
            <DialogTitle className="text-xl font-semibold">
              {activeVideo?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            {activeVideo && (
              <iframe
                src={activeVideo.url}
                className="w-full h-full rounded-2xl"
                allowFullScreen
                loading="lazy"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding video */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="w-[95%] max-w-md rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl mb-4">Add a new YouTube Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title of Video"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Input
              placeholder="YouTube Link"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddVideo}
              className="bg-blue-600 text-white hover:bg-blue-500"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
