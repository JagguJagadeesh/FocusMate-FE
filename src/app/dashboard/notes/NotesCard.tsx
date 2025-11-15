'use client'

import Image from 'next/image'
import { Trash } from 'lucide-react'
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
  description,
  imgData,
  onDelete,
  onClick
}: NotesCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleting(true)

    try {
      await deleteNote(id)
      toast.success("Note deleted successfully!")
      if (onDelete) onDelete(id)
    } catch (error) {
      toast.error("Failed to delete note")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatTime = (date?: string) => {
    if (!date) return ''
    const noteDate = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - noteDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return noteDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <motion.div
        onClick={onClick}
        className="relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-700"
        animate={{
          boxShadow: isHovered
            ? '0 10px 30px rgba(0, 0, 0, 0.1)'
            : '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}
        whileHover={{ y: -4 }}
      >

        <div className="flex gap-5 p-5">
          {/* Image Section */}
          {imgData && (
            <div className="relative w-28 h-28 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 shadow-sm border border-gray-200 dark:border-gray-700">
              <Image
                src={imgData}
                alt={title}
                fill
                className="object-contain group-hover:scale-125 transition-transform duration-700"
                sizes="120px"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Top Part */}
            <div className="space-y-2">
              <motion.h3
                className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {title || 'Untitled Note'}
              </motion.h3>

              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Bottom Part */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-500 tracking-wide">
                {formatTime()}
              </span>
              <motion.span
                className="text-xs font-semibold text-blue-600 dark:text-blue-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                transition={{ duration: 0.2 }}
              >
                View →
              </motion.span>
            </div>
          </div>

          {/* Action Menu */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="More options"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border-0 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 rounded-lg m-2 cursor-pointer font-medium"
                >
                  <Trash className="w-4 h-4 mr-3" />
                  {isDeleting ? 'Deleting...' : 'Delete Note'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
