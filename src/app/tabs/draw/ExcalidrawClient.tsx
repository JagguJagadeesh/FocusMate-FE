'use client'

import React, { useState, useCallback } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Excalidraw,
  exportToCanvas,
  getCommonBounds,
  getNonDeletedElements,
} from "@excalidraw/excalidraw"
import "@excalidraw/excalidraw/index.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Download,
  Save,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  Palette,
  FileText
} from "lucide-react"
import { createNote } from "@/services/userService"
import useUserStore from "@/stores/useUserStore"
import { toast } from "sonner"

// Types
interface NoteData {
  title: string
  description: string
  imageData: string
}


// Constants
const CANVAS_CONFIG = {
  padding: 100,
  backgroundColor: "#ffffff",
  exportWithDarkMode: false,
} as const

const ExcalidrawWrapper: React.FC = () => {
  const user = useUserStore((s) => s.user)

  // State
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)
  const [canvasUrl, setCanvasUrl] = useState("")
  const [noteTitle, setNoteTitle] = useState("")
  const [noteDescription, setNoteDescription] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const initialData = {
    appState: {
      exportWithDarkMode: false,
      theme: "light" as const,
    },
    elements: [],
  }

  // Export drawing to canvas
  const handleExport = useCallback(async () => {
    if (!excalidrawAPI) {
      toast.error("Drawing canvas not ready")
      return
    }

    try {
      setIsExporting(true)

      const elements = getNonDeletedElements(excalidrawAPI.getSceneElements())

      if (!elements || elements.length === 0) {
        toast.warning("No drawing to export", {
          description: "Please draw something before exporting"
        })
        return
      }

      const [x1, y1, x2, y2] = getCommonBounds(elements)
      const width = Math.max(x2 - x1 + CANVAS_CONFIG.padding, 400)
      const height = Math.max(y2 - y1 + CANVAS_CONFIG.padding, 300)

      const canvas = await exportToCanvas({
        elements,
        appState: {
          ...initialData.appState,
          exportWithDarkMode: CANVAS_CONFIG.exportWithDarkMode,
          viewBackgroundColor: CANVAS_CONFIG.backgroundColor,
        },
        files: excalidrawAPI.getFiles(),
        getDimensions: () => ({ width, height }),
      })

      const dataUrl = canvas.toDataURL("image/png", 0.9)
      setCanvasUrl(dataUrl)
      setIsDialogOpen(true)

      toast.success("Drawing exported successfully!")
    } catch (error) {
      console.error("Export failed:", error)
      toast.error("Failed to export drawing", {
        description: "Please try again"
      })
    } finally {
      setIsExporting(false)
    }
  }, [excalidrawAPI, initialData.appState])

  // Save note
  const handleSave = useCallback(async () => {
    if (!noteTitle.trim()) {
      toast.error("Title is required", {
        description: "Please enter a title for your note"
      })
      return
    }

    if (!canvasUrl) {
      toast.error("No image to save", {
        description: "Please export your drawing first"
      })
      return
    }

    try {
      setIsSaving(true)

      const noteData: NoteData = {
        title: noteTitle.trim(),
        description: noteDescription.trim(),
        imageData: canvasUrl,
      }

      await createNote({
        ownerID: user.id,
        title: noteData.title,
        description: noteData.description,
        imgData: noteData.imageData,
      })

      toast.success("Note saved successfully!", {
        description: "Your drawing has been saved to your notes"
      })

      // Reset form
      setNoteTitle("")
      setNoteDescription("")
      setCanvasUrl("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Save failed:", error)
      toast.error("Failed to save note", {
        description: "Please try again"
      })
    } finally {
      setIsSaving(false)
    }
  }, [noteTitle, noteDescription, canvasUrl, user.id])

  // Download image directly
  const handleDownload = useCallback(() => {
    if (!canvasUrl) return

    const link = document.createElement('a')
    link.download = `drawing-${Date.now()}.png`
    link.href = canvasUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Image downloaded!")
  }, [canvasUrl])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Floating Action Buttons */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-3">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/dashboard/notes">
            <Button
              size="icon"
              variant="outline"
              className="h-12 w-12 rounded-full shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-red-600" />
            </Button>
          </Link>
        </motion.div>

        {/* Export & Save Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="h-12 px-4 sm:px-6 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 transition-all duration-200 hover:shadow-xl hover:scale-105"
              >
                {isExporting ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <ImageIcon className="h-5 w-5 mr-2" />
                )}
                <span className="hidden sm:inline">
                  {isExporting ? "Exporting..." : "Export & Save"}
                </span>
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[90vw] sm:w-[85vw] max-w-2xl max-h-[85vh] sm:max-h-[90vh] p-0 rounded-2xl shadow-2xl border-0 bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
              {/* Fixed Header */}
              <DialogHeader className="flex-shrink-0 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-t-2xl border-b border-slate-200 dark:border-slate-700">
                <DialogTitle className="flex items-center gap-3 text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Save Your Drawing
                </DialogTitle>
              </DialogHeader>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Preview Image */}
                  <AnimatePresence>
                    {canvasUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                      >
                        <Card className="overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700">
                          <CardContent className="p-2">
                            <div className="relative bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden">
                              <img
                                src={canvasUrl}
                                alt="Exported drawing"
                                className="w-full h-auto max-h-[200px] sm:max-h-[250px] object-contain"
                                style={{ display: 'block' }}
                              />
                              <Badge className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-0">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Ready
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Download Button */}
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          size="sm"
                          className="absolute bottom-3 left-3 text-xs bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Title *
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        placeholder="Give your drawing a title..."
                        className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        rows={3}
                        value={noteDescription}
                        onChange={(e) => setNoteDescription(e.target.value)}
                        placeholder="Add a description for your drawing..."
                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-500 resize-none transition-colors"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <DialogFooter className="flex-shrink-0 p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl">
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="flex-1 h-11 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !noteTitle.trim() || !canvasUrl}
                    className="flex-1 h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Note
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>


        </motion.div>
      </div>

      {/* Drawing Canvas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-700/50"
      >
        <Excalidraw
          initialData={initialData}
          excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
          theme="light"
        />
      </motion.div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {(isExporting || isSaving) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="font-medium">
                  {isExporting ? "Exporting drawing..." : "Saving note..."}
                </span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExcalidrawWrapper
