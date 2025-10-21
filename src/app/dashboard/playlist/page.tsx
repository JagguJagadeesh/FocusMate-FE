'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlusIcon,
  Trash2,
  Video,
  ExternalLink,
  Search,
  Grid3X3,
  List,
  Youtube,
  } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import useUserStore from '@/stores/useUserStore'
import { addVideo, deleteVideo, getAllVideos } from '@/services/userService'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Component } from '@/components/loding'

type Video = {
  title: string;
  link: string;
  id: string;
  type: 'video' | 'playlist';
  createdAt?: string;
}

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

function getVideoType(url: string): 'video' | 'playlist' {
  return url.includes('list=') ? 'playlist' : 'video';
}

export default function PlayList() {
  const userData = useUserStore(s => s.user)
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [active, setActive] = useState<Video | null>(null)
  const [openVideo, setOpenVideo] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const fetchVideos = async () => {
    setIsLoading(true)
    try {
      const res = await getAllVideos(userData.id)
      const videosWithType = (res.data || []).map(video => ({
        ...video,
        type: getVideoType(video.link) as 'video' | 'playlist'
      }))
      setVideos(videosWithType)
      setFilteredVideos(videosWithType)
    } catch {
      toast.error('Failed to fetch videos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userData?.id) {
      fetchVideos()
    }
  }, [userData])

  useEffect(() => {
    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredVideos(filtered)
  }, [searchQuery, videos])

  const onAdd = async () => {
    if (!title.trim() || !link.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    const embed = getYouTubeEmbedUrl(link)
    if (!embed) {
      toast.error('Please enter a valid YouTube URL')
      return
    }

    setIsAdding(true)
    try {
      const videoType = getVideoType(link)
      await addVideo({
        ownerID: userData.id,
        title: title.trim(),
        link: embed,
        type: videoType
      })
      toast.success(`${videoType === 'playlist' ? 'Playlist' : 'Video'} added successfully!`)
      setTitle('')
      setLink('')
      setOpenAdd(false)
      await fetchVideos()
    } catch {
      toast.error('Failed to add video')
    } finally {
      setIsAdding(false)
    }
  }

  const onDelete = async (id: string) => {
    try {
      await deleteVideo(id)
      setVideos(videos.filter(v => v.id !== id))
      setFilteredVideos(filteredVideos.filter(v => v.id !== id))
      toast.success('Video deleted successfully')
      setDeleteConfirm(null)
    } catch {
      toast.error('Failed to delete video')
    }
  }

  const stats = {
    total: videos.length,
    videos: videos.filter(v => v.type === 'video').length,
    playlists: videos.filter(v => v.type === 'playlist').length,
    thisWeek: videos.filter(video => {
      if (!video.createdAt) return false
      const videoDate = new Date(video.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return videoDate >= weekAgo
    }).length
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30">
      {/* Enhanced Header */}
      <SidebarInset>
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  My Playlist
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.total} items • {stats.videos} videos • {stats.playlists} playlists
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search videos..."
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
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>
          </div>
        </header>
      </SidebarInset>

      {/* Main Content */}
      <main className="px-6 pb-12 mt-6">
        <AnimatePresence>
          {isLoading ? (
            <div className="h-96 flex justify-center items-center ">
              <Component/>
            </div>
          ) : filteredVideos.length === 0 && searchQuery ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-96 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 rounded-full flex items-center justify-center mb-6">
                <Search className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No videos found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                No videos match {searchQuery}. Try adjusting your search terms.
              </p>
            </motion.div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 max-w-4xl mx-auto'
              }`}>
              {/* Add Video Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpenAdd(true)}
                className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-200"
              >
                <div className="aspect-video flex items-center justify-center p-6">
                  <div className="text-center">
                    <PlusIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-base font-medium text-gray-900 dark:text-white">Add New Video</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload or link videos</p>
                  </div>
                </div>
              </motion.div>


              {/* Video Cards */}
              {filteredVideos.filter(v => v?.link && v?.id && v?.title).map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="group cursor-pointer rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                  onClick={() => { setActive(video); setOpenVideo(true); }}
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
                    <iframe
                      src={video.link}
                      title={video.title}
                      className="w-full h-full"
                      loading="lazy"
                    />

                    {/* Type Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 text-xs font-medium text-white rounded ${video.type === 'playlist' ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                        {video.type === 'playlist' ? 'Playlist' : 'Video'}
                      </span>
                    </div>

                    {/* Delete Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(video.id);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-8 w-8 p-0 bg-white dark:bg-gray-900 text-red-500 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Video Info */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 text-sm">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <Youtube className="w-3 h-3 text-red-500" />
                      YouTube {video.type}
                    </p>
                  </div>
                </motion.div>
              ))}


              {/* Empty State */}
              {filteredVideos.length === 0 && !searchQuery && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full flex flex-col items-center justify-center h-96 text-center"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 rounded-full flex items-center justify-center mb-6">
                    <Video className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Your playlist is empty
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                    Start building your collection! Add YouTube videos and playlists to keep your favorite content organized.
                  </p>
                  <Button
                    onClick={() => setOpenAdd(true)}
                    className="h-12 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                  >
                    <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Add Your First Video
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Enhanced Video Dialog */}
      <Dialog open={openVideo} onOpenChange={setOpenVideo}>
        <DialogContent className="max-w-[60vw] w-full h-auto p-0 border-0 bg-black rounded-xl overflow-hidden">
          {/* Header Bar */}
          <div className="relative bg-gray-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Youtube className="w-5 h-5 text-red-500" />
              <h2 className="text-white font-semibold text-lg">{active?.title}</h2>
            </div>
          </div>

          {/* Video Player */}
          <div className="aspect-video w-full bg-black">
            <iframe
              src={active?.link || ''}
              title={active?.title || ''}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Footer Bar */}
          <div className="bg-gray-900 px-6 py-4 flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => window.open(active?.link.replace('/embed/', '/watch?v='), '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in YouTube
            </Button>
          </div>
        </DialogContent>
      </Dialog>



      {/* Enhanced Add Video Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="w-full max-w-lg p-0 overflow-hidden rounded-3xl border-0 shadow-2xl bg-white dark:bg-gray-900">
          <div className="relative bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-8 border-b border-gray-200 dark:border-gray-800">
            
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white text-left pr-12">
                Add YouTube Content
              </DialogTitle>
              <p className="text-gray-600 dark:text-gray-400 text-left">
                Add videos or playlists from YouTube to your collection
              </p>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                YouTube URL
              </Label>
              <Input
                id="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={link}
                onChange={e => setLink(e.target.value)}
                className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supports both individual videos and playlists
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpenAdd(false)}
                className="h-12 px-6 rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={onAdd}
                disabled={isAdding}
                className="h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isAdding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    Add to Playlist
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Video?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This action cannot be undone. The video will be permanently removed from your playlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteConfirm(null)}
              className="rounded-xl"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && onDelete(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
