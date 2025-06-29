'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import { PlusIcon, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import useUserStore from '@/stores/useUserStore'
import { addVideo, deleteVideo, getAllVideos } from '@/services/userService'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

type Video = { title: string; link: string; id: string; type: 'video' | 'playlist' }

function getYouTubeEmbedUrl(url: string): string {
  const videoRegex = /(?:youtu\.be\/|v=|\/embed\/)([\w-]+)/;
  const playlistRegex = /[?&]list=([\w-]+)/;

  const playlistMatch = url.match(playlistRegex);
  if (playlistMatch) {
    return `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}`;
  }

  const videoMatch = url.match(videoRegex);
  return videoMatch ? `https://www.youtube.com/embed/${videoMatch[1]}` : '';
}


export default function PlayList() {
  const userData = useUserStore(s => s.user)
  const [videos, setVideos] = useState<Video[]>([])
  const [active, setActive] = useState<Video | null>(null)
  const [openVideo, setOpenVideo] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')

  const fetchVideos = async () => {
    try {
      const res = await getAllVideos(userData.id)
      setVideos(res.data || [])
    } catch {
      toast.error('Failed to fetch videos')
    }
  }

  useEffect(() => {
    if (userData?.id) {
      fetchVideos()
    }
  }, [userData])

  const onAdd = async () => {
    if (!title || !link) return toast.error('Required')
    const embed = getYouTubeEmbedUrl(link)
    if (!embed) return toast.error('Invalid URL')

    try {
      await addVideo({ ownerID: userData.id, title, link: embed })
      toast.success('Video Added!')
      setTitle('')
      setLink('')
      setOpenAdd(false)
      await fetchVideos() 
    } catch {
      toast.error('Failed to add video')
    }
  }

  const onDelete = async (id: string) => {
    try {
      await deleteVideo(id)
      setVideos(videos.filter(v => v.id !== id))
      toast.success('Video Deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="w-full">
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 px-4 border-b bg-background/80 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <h2 className="text-xl font-semibold">{userData.name}&apos;s Playlist</h2>
        </header>
      </SidebarInset>

      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos?.filter(v => v?.link && v?.id && v?.title).map((v, i) => (
          <motion.div
            key={v.id}
            className="group cursor-pointer overflow-hidden rounded-lg bg-white dark:bg-zinc-900 shadow-lg"
            whileHover={{ scale: 1.02 }}
            onClick={() => { setActive(v); setOpenVideo(true); }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="relative aspect-video group-hover:brightness-110 transition">
              <iframe
                src={v.link}
                title={v.title}
                className="w-full h-full pointer-events-none"
                loading="lazy"
              />
            </div>
            <div className="flex justify-between items-center p-3">
              <p className="truncate font-medium">{v.title}</p>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); onDelete(v.id) }}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </motion.div>
        ))}

        <div
          onClick={() => setOpenAdd(true)}
          className="w-full cursor-pointer rounded-xl  bg-muted hover:bg-muted/70 shadow-2xl transition-all"
        >
          <div className="aspect-video w-full flex items-center justify-center rounded-t-xl text-violet-700 bg-gradient-to-br from-gray-300 to-gray-500">
            <PlusIcon className="w-10 h-10" />
          </div>
          <div className="p-4 flex items-center justify-center font-medium">
            Add New Video
          </div>
        </div>
      </main>

      <Dialog open={openVideo} onOpenChange={setOpenVideo}>
        <DialogContent className="w-full max-w-6xl p-6 flex flex-col gap-4 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              {active?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="aspect-video w-full">
            <iframe
              src={active?.link || ''}
              title={active?.title || ''}
              className="w-full h-full rounded-lg"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="w-full max-w-md p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle>Add a YouTube Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <Input
              placeholder="YouTube URL"
              value={link}
              onChange={e => setLink(e.target.value)}
            />
          </div>
          <div className="flex justify-end mt-6 space-x-2">
            <Button variant="outline" onClick={() => setOpenAdd(false)}>Cancel</Button>
            <Button onClick={onAdd}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
