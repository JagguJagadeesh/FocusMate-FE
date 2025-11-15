'use client'

import { useEffect, useState } from 'react'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Trash2, Download, Eye, Search, X, File, Cloud, Loader2, Calendar, HardDrive } from 'lucide-react'
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
      setDeleteConfirm(null)
      setOpen(false)
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
        {/* Header - Responsive */}
        <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="flex h-12 sm:h-14 items-center px-2 sm:px-4 md:px-6 gap-1 sm:gap-2">
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

        {/* Main Content - Responsive */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <section className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8"
            >
              {/* Top Section - Responsive Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left: Title & Search */}
                <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-1">My PDFs</h1>
                    <p className="text-sm sm:text-base">Manage and organize your documents</p>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Search PDFs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-10 py-2 sm:py-3 text-sm sm:text-base rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {searchQuery && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Right: Stats Card - Responsive */}
                {pdfs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800/50 p-4 sm:p-6 space-y-3 sm:space-y-4"
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-semibold mb-1">Total Files</p>
                      <p className="text-2xl sm:text-3xl font-black">{pdfs.length}</p>
                    </div>
                    <Separator className="bg-blue-200 dark:bg-blue-800/50" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold mb-1">Total Size</p>
                      <p className="text-base sm:text-lg font-bold">{formatFileSize(totalSize)}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Content */}
              {loadingFiles ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-48 sm:h-64">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                    <Loader2 size={40} className="sm:w-12 sm:h-12" />
                  </motion.div>
                  <p className="mt-4 text-sm sm:text-base font-medium">Loading files...</p>
                </motion.div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {/* Upload Zone - Responsive */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('pdf-upload')?.click()}
                    className={`relative group cursor-pointer rounded-xl sm:rounded-2xl border-2 border-dashed transition-all duration-300 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 ${dragActive
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
                          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10" />
                        </motion.div>
                      ) : (
                        <Cloud className="w-8 h-8 sm:w-10 sm:h-10 transition-colors" />
                      )}
                    </motion.div>

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-sm sm:text-base">
                        {uploading ? 'Uploading...' : 'Upload PDF'}
                      </h3>
                      <p className="text-xs sm:text-sm">
                        {uploading ? 'Please wait...' : 'Drag & drop or click to select'}
                      </p>
                    </div>
                  </motion.div>

                  {/* PDFs List - Responsive */}
                  {filteredPdfs.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 sm:py-16">
                      <File size={48} className="sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-base sm:text-lg font-bold mb-2">
                        {searchQuery ? 'No PDFs found' : 'No PDFs yet'}
                      </h3>
                      <p className="text-sm sm:text-base">
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
                            whileHover={{ x: 4 }}
                            className="group"
                          >
                            <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                              {/* Icon */}
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition-all">
                                <File className="w-5 h-5 sm:w-6 sm:h-6" />
                              </div>

                              {/* Info - Responsive */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base transition-colors truncate" title={pdf.name}>
                                  {pdf.name}
                                </h3>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs">
                                  <div className="flex items-center gap-1">
                                    <HardDrive className="w-3 h-3" />
                                    {formatFileSize(pdf.size)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span className="hidden sm:inline">{formatDate(pdf.createdAt)}</span>
                                    <span className="sm:hidden">{new Date(pdf.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions - Touch Friendly */}
                              <div className="flex items-center gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handlePreview(pdf.url)}
                                  className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                                  title="Preview"
                                >
                                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                                <motion.a
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  href={pdf.url}
                                  download={pdf.name}
                                  className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                                  title="Download"
                                >
                                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.a>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDelete(pdf.id, pdf.name)}
                                  className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
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

      {/* Preview Dialog - Full Screen on Mobile, Large on Desktop */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="w-full h-[95vh] max-w-[95vw] sm:max-w-[90vw] lg:max-w-7xl p-0 rounded-lg sm:rounded-2xl overflow-hidden border-0 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-full"
          >
            <DialogHeader className="flex-shrink-0 p-3 sm:p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold">PDF Preview</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950">
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
function setDeleteConfirm(arg0: null) {
  throw new Error('Function not implemented.')
}

function setOpen(arg0: boolean) {
  throw new Error('Function not implemented.')
}

