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
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Download,
  Save,
  Image as ImageIcon,
  Loader2,
  FileText,
  Info,
} from "lucide-react"
import { createNote } from "@/services/userService"
import useUserStore from "@/stores/useUserStore"
import { toast } from "sonner"


const CANVAS_CONFIG = {
  padding: 100,
  backgroundColor: "#ffffff",
  exportWithDarkMode: false,
} as const

const ExcalidrawWrapper: React.FC = () => {
  const user = useUserStore((s) => s.user)
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)
  const [canvasUrl, setCanvasUrl] = useState("")
  const [noteTitle, setNoteTitle] = useState("")
  const [noteDescription, setNoteDescription] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const initialData = {
    appState: { exportWithDarkMode: false, theme: "light" as const },
    elements: [],
  }

  const handleExport = useCallback(async () => {
    if (!excalidrawAPI) return

    try {
      setIsExporting(true)
      const elements = getNonDeletedElements(excalidrawAPI.getSceneElements())

      if (!elements || elements.length === 0) {
        toast.warning("No drawing to export")
        return
      }

      const [x1, y1, x2, y2] = getCommonBounds(elements)
      const width = Math.max(x2 - x1 + CANVAS_CONFIG.padding, 400)
      const height = Math.max(y2 - y1 + CANVAS_CONFIG.padding, 300)

      const canvas = await exportToCanvas({
        elements,
        appState: { ...initialData.appState, viewBackgroundColor: CANVAS_CONFIG.backgroundColor },
        files: excalidrawAPI.getFiles(),
        getDimensions: () => ({ width, height }),
      })

      setCanvasUrl(canvas.toDataURL("image/png", 0.9))
      setIsDialogOpen(true)
      toast.success("Drawing exported!")
    } catch (error) {
      toast.error("Export failed")
    } finally {
      setIsExporting(false)
    }
  }, [excalidrawAPI, initialData.appState])

  const handleSave = useCallback(async () => {
    if (!noteTitle.trim() || !canvasUrl) {
      toast.error("Title and drawing required")
      return
    }

    try {
      setIsSaving(true)
      await createNote({
        autherID: user.id,
        title: noteTitle.trim(),
        description: noteDescription.trim(),
        imgData: canvasUrl,
      })
      toast.success("Note saved!")
      setNoteTitle("")
      setNoteDescription("")
      setCanvasUrl("")
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Failed to save")
    } finally {
      setIsSaving(false)
    }
  }, [noteTitle, noteDescription, canvasUrl, user.id])

  const handleDownload = useCallback(() => {
    if (!canvasUrl) return
    const link = document.createElement('a')
    link.download = `drawing-${Date.now()}.png`
    link.href = canvasUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Downloaded!")
  }, [canvasUrl])

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Left Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="hidden md:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl p-6 gap-6 overflow-y-auto"
      >
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Drawing Tools</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Create and organize your sketches</p>
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-300">
                <p className="font-medium mb-1">Pro Tip</p>
                <p className="opacity-90">Use the toolbar to draw shapes, add text, and customize your sketch</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                  Export & Save
                </Button>
              </motion.div>
            </DialogTrigger>

            <DialogContent className="w-[90vw] sm:w-[85vw] max-w-2xl p-0 rounded-2xl">
              <DialogHeader className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-b">
                <DialogTitle className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Save Drawing
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto">
                <div className="px-6 space-y-2">
                  {canvasUrl && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="overflow-hidden border-2 border-dashed">
                        <CardContent className="p-2">
                          <img src={canvasUrl} alt="Drawing" className="w-full h-auto max-h-[200px] rounded-lg object-contain" />
                          {/* <Badge className="absolute top-2 right-2"><CheckCircle className="w-3 h-3 mr-1" />Ready</Badge> */}
                        </CardContent>
                      </Card>
                      <Button onClick={handleDownload} variant="outline" size="sm" className="mt-2 w-full">
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Title..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea rows={3} value={noteDescription} onChange={(e) => setNoteDescription(e.target.value)} placeholder="Description..." />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="p-2">
                <DialogClose asChild>
                  <Button variant="outline" className="flex-1" disabled={isSaving}>Cancel</Button>
                </DialogClose>
                <Button onClick={handleSave} disabled={isSaving || !noteTitle.trim() || !canvasUrl} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Back Button */}
        <Link href="/dashboard/notes" className="mt-auto">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Button>
        </Link>
      </motion.aside>

      {/* Main Canvas Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <motion.div initial={{ y: -100 }} animate={{ y: 0 }} className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
          <Link href="/dashboard/notes">
            <Button size="sm" variant="outline"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <h1 className="font-bold text-slate-900 dark:text-white">Draw</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={handleExport} disabled={isExporting} className="bg-gradient-to-r from-blue-500 to-purple-600">
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </Button>
            </DialogTrigger>
            {/* Same dialog content */}
          </Dialog>
        </motion.div>

        {/* Canvas */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-hidden">
          <Excalidraw initialData={initialData} excalidrawAPI={(api: any) => setExcalidrawAPI(api)} theme="light" />
        </motion.div>
      </div>

      {/* Loading */}
      <AnimatePresence>
        {(isExporting || isSaving) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 backdrop-blur z-50 flex items-center justify-center">
            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="font-medium">{isExporting ? "Exporting..." : "Saving..."}</span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExcalidrawWrapper
