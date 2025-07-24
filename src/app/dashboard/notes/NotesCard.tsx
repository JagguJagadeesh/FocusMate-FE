'use client'

import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Trash, FileText, MoreVertical, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteNote } from '@/services/userService'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from 'react'

interface NotesCardProps {
  id: string
  title: string
  description: string
  imgData: string
  createdAt?: string
  onDelete?: (id: string) => void
  onClick?: () => void
}

export default function NotesCard({ 
  id, 
  title, 
  imgData, 
  onDelete,
  onClick 
}: NotesCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleting(true)
    
    try {
      await deleteNote(id)
      toast.success("Note deleted successfully!", {
        description: "Your note has been permanently removed.",
      })
      if (onDelete) onDelete(id)
    } catch (error) {
      toast.error("Failed to delete note.", {
        description: "Please try again later.",
      })
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCardClick = () => {
    if (onClick) onClick()
  }

 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
      className="group"
    >
      <Card 
        className="relative w-56  cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900"
        onClick={handleCardClick}
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-purple-50/10 to-pink-50/20 dark:from-blue-950/10 dark:via-purple-950/5 dark:to-pink-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
        
        {/* Content Container */}
        <div className="relative z-10">
          {/* Header */}
          <CardHeader className="pb-4 px-6 pt-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 leading-tight">
                  {title || 'Untitled Note'}
                </CardTitle>
              </div>
              
              {/* Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl border-0 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20 rounded-lg m-1"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete Note'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="px-6 pb-4">
            {/* Image Section */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-200/50 dark:border-gray-700/50 group/image">
              {imgData ? (
                <>
                  <Image
                    src={imgData}
                    alt={`Note: ${title}`}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Image Overlay with View Action */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <Eye className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-4 mb-3 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold">No Preview Available</span>
                  <span className="text-xs opacity-75 mt-1">Click to view content</span>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}
