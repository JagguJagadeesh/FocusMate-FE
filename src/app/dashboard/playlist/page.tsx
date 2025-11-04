'use client'

import React, { useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlusIcon,
  Trash2,
  Video,
  ExternalLink,
  Search,
  Youtube,
  Play,
  X,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import useUserStore from '@/stores/useUserStore'
import { addVideo, deleteVideo, getAllVideos } from '@/services/userService'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Component } from '@/components/Loaders/loding'

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
  if (playlistMatch) return `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}`;
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
  const [filterType, setFilterType] = useState<'all' | 'video' | 'playlist'>('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    if (userData?.id) fetchVideos()
  }, [userData])

  useEffect(() => {
    let filtered = videos.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (filterType !== 'all') {
      filtered = filtered.filter(v => v.type === filterType)
    }
    setFilteredVideos(filtered)
  }, [searchQuery, videos, filterType])

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
      toast.success('Added successfully!')
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
      toast.success('Deleted')
      setDeleteConfirm(null)
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30">
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md transition-[width,height] ease-linear">
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
                  <BreadcrumbPage>Playlist</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Mobile Filter Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </header>
      </SidebarInset>

      <div className="flex relative">
        {/* LEFT SIDEBAR - Filters */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <>
              {/* Mobile Overlay */}
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                />
              )}

              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed lg:sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-64 border-r border-gray-200 dark:border-gray-800 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 p-6 overflow-y-auto z-40"
              >
                {/* Close button for mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 lg:hidden h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
                      Filters
                    </h3>
                    
                    <div className="space-y-1">
                      <button
                        onClick={() => { setFilterType('all'); setSidebarOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all group ${
                          filterType === 'all' 
                            ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>All</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            filterType === 'all'
                              ? 'border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                              : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            {videos.length}
                          </span>
                        </div>
                      </button>

                      <button
                        onClick={() => { setFilterType('video'); setSidebarOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all group ${
                          filterType === 'video' 
                            ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Videos</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            filterType === 'video'
                              ? 'border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                              : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            {videos.filter(v => v.type === 'video').length}
                          </span>
                        </div>
                      </button>

                      <button
                        onClick={() => { setFilterType('playlist'); setSidebarOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all group ${
                          filterType === 'playlist' 
                            ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Playlists</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            filterType === 'playlist'
                              ? 'border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                              : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            {videos.filter(v => v.type === 'playlist').length}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                    <Button
                      onClick={() => { setOpenAdd(true); setSidebarOpen(false); }}
                      className="w-full h-11 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Video
                    </Button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* RIGHT CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 " />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 border-2 border-gray-200 dark:border-gray-800 focus:border-blue-400 dark:focus:border-blue-600 rounded-xl bg-white/50 dark:bg-gray-900/50 "
              />
            </div>
          </motion.div>

          {/* Video Grid */}
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <Component />
            </div>
          ) : filteredVideos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl"
            >
              <div className="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center mb-6">
                <Video className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No videos found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm mb-8">
                {searchQuery ? `No results for "${searchQuery}"` : 'Add your first video to get started'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setOpenAdd(true)}
                  className="h-11 px-6 border-2 border-blue-600 dark:border-blue-500 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => { setActive(video); setOpenVideo(true); }}
                  className="group cursor-pointer rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
                    <iframe
                      src={video.link}
                      title={video.title}
                      className="w-full h-full pointer-events-none"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(video.id); }}
                      className="absolute top-3 right-3 h-9 w-9 p-0 rounded-lg border-2 border-white bg-white/90 hover:bg-white text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-3 leading-snug">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <Youtube className="w-4 h-4 text-red-600" />
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {video.type}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Video Player Dialog */}
      <Dialog open={openVideo} onOpenChange={setOpenVideo}>
        <DialogContent className="max-w-4xl w-full p-0 border-0 rounded-lg overflow-hidden">
          <div className=" px-6 pt-4 flex items-center justify-between ">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <h2 className=" font-semibold ">{active?.title}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mr-10 rounded-lg"
              onClick={() => window.open(active?.link.replace('/embed/', '/watch?v='), '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in YouTube
            </Button>
          </div>
          <div className="aspect-video w-full  rounded-lg bg-black">
            <iframe
              src={active?.link || ''}
              title={active?.title || ''}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Video Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add YouTube Content</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Add videos or playlists from YouTube</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Title</Label>
                <Input
                  placeholder="Enter a title..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">YouTube URL</Label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  className="h-11 rounded-lg"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supports both videos and playlists
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={() => setOpenAdd(false)}
              className="h-11 px-6 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={onAdd}
              disabled={isAdding}
              className="h-11 px-6 rounded-lg"
            >
              {isAdding ? 'Adding...' : 'Add to Playlist'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The video will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && onDelete(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
