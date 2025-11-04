'use client'

import { useEffect, useState } from 'react'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import {  Trash2, Download, Eye, Search, X, File, Cloud, Loader2, Calendar, HardDrive } from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import { getFiles, uploadFile, deleteFile } from '@/services/userService'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { motion, AnimatePresence } from 'framer-motion'

interface PdfFile {
  id: string
  name: string
  url: string
  size: number
  createdAt: string
}

export default function Page() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const { user } = useUserStore()

  useEffect(() => {
    if (!user?.id) return
    setLoadingFiles(true)
    getFiles({ handlerId: user.id })
      .then(data => setPdfs(data.files.files || []))
      .catch(() => toast.error('Failed to load files'))
      .finally(() => setLoadingFiles(false))
  }, [user])

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !files[0] || !user?.id) return
    const file = files[0]

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed!')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('handlerId', user.id)
      formData.append('name', file.name)
      formData.append('file', file)

      const newFile = await uploadFile(formData)
      setPdfs(prev => [newFile, ...prev])
      toast.success('PDF uploaded successfully! 📄')
    } catch (error) {
      console.error(error)
      toast.error('Upload failed!')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!user?.id) return
    if (!confirm(`Delete "${name}"?`)) return

    try {
      await deleteFile({ handlerId: user.id, id })
      setPdfs(prev => prev.filter(pdf => pdf.id !== id))
      toast.success('File deleted')
    } catch {
      toast.error('Failed to delete file')
    }
  }

  const handlePreview = (url: string) => {
    if (!url) {
      toast.error('Preview not available')
      return
    }
    setPreviewUrl(url)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const filteredPdfs = pdfs.filter(pdf =>
    (pdf.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const totalSize = pdfs.reduce((sum, pdf) => sum + pdf.size, 0)

  return (
    <>
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="flex h-14 items-center px-4 md:px-6 gap-2">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>PDFs</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <section className="flex-1 overflow-y-auto p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto space-y-8"
            >
              {/* Top Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Title & Search */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-1">My PDFs</h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage and organize your documents</p>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search PDFs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {searchQuery && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Right: Stats Card */}
                {pdfs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800/50 p-6 space-y-4"
                  >
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">Total Files</p>
                      <p className="text-3xl font-black text-slate-900 dark:text-white">{pdfs.length}</p>
                    </div>
                    <Separator className="bg-blue-200 dark:bg-blue-800/50" />
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">Total Size</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{formatFileSize(totalSize)}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Content */}
              {loadingFiles ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                    <Loader2 size={50} className="text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Loading files...</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {/* Upload Zone */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('pdf-upload')?.click()}
                    className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 flex items-center gap-6 ${
                      dragActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-blue-400 dark:hover:border-blue-600'
                    }`}
                  >
                    <input
                      id="pdf-upload"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={e => handleFileUpload(e.target.files)}
                      disabled={uploading}
                    />

                    <motion.div
                      animate={{ scale: uploading ? 1 : [1, 1.1, 1] }}
                      transition={{ repeat: uploading ? 0 : Infinity, duration: 2 }}
                    >
                      {uploading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                          <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                      ) : (
                        <Cloud className="w-10 h-10 text-slate-400 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      )}
                    </motion.div>

                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {uploading ? 'Uploading...' : 'Upload PDF'}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {uploading ? 'Please wait...' : 'Drag & drop or click to select'}
                      </p>
                    </div>
                  </motion.div>

                  {/* PDFs List */}
                  {filteredPdfs.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                      <File size={60} className="text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {searchQuery ? 'No PDFs found' : 'No PDFs yet'}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {searchQuery ? 'Try a different search' : 'Upload your first PDF to get started'}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      <AnimatePresence>
                        {filteredPdfs.map((pdf, i) => (
                          <motion.div
                            key={pdf.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ x: 8 }}
                            className="group"
                          >
                            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                              {/* Icon */}
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50 flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition-all">
                                <File className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={pdf.name}>
                                  {pdf.name}
                                </h3>
                                <div className="flex items-center gap-4 mt-1 text-xs text-slate-600 dark:text-slate-400">
                                  <div className="flex items-center gap-1">
                                    <HardDrive className="w-3 h-3" />
                                    {formatFileSize(pdf.size)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(pdf.createdAt)}
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handlePreview(pdf.url)}
                                  className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                                  title="Preview"
                                >
                                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </motion.button>
                                <motion.a
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  href={pdf.url}
                                  download={pdf.name}
                                  className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                                  title="Download"
                                >
                                  <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </motion.a>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDelete(pdf.id, pdf.name)}
                                  className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </section>
        </main>
      </SidebarInset>

      {/* Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-6xl max-h-[85vh] p-0 rounded-2xl overflow-hidden border-0 shadow-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-full">
            <DialogHeader className="flex-shrink-0 p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <DialogTitle className="text-2xl font-bold">PDF Preview</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              {previewUrl && (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
              )}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
}
