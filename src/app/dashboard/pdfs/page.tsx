'use client'

import { useEffect, useState } from 'react'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { FilePlus, Trash2, Download, Eye, Search, X , File } from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import { getFiles, uploadFile, deleteFile } from '@/services/userService'
import { toast } from 'sonner'
import { DialogHeader, Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

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
  const { user } = useUserStore()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return
    setLoadingFiles(true)
    getFiles({ handlerId: user.id })
      .then(data => setPdfs(data.files.files || []))
      .catch(() => toast.error('Failed to get data'))
      .finally(() => setLoadingFiles(false))
  }, [user])

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !files[0] || !user?.id) return
    const file = files[0]

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed!')
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
      toast.success('Uploaded file')
    } catch {
      toast.error('Upload failed!')
    } finally {
      setUploading(false)
    }
  }


  const handleDelete = async (id: string) => {
    if (!user?.id) return
    if (!confirm('Are you sure you want to delete this file?')) return
    try {
      await deleteFile({ handlerId: user.id, id })
      setPdfs(prev => prev.filter(pdf => pdf.id !== id))
      toast.success('File deleted!')
    } catch {
      toast.error('Failed to delete file.')
    }
  }

  const handlePreview = (url: string) => {
    if (!url) {
      toast.error('This PDF has no valid URL.')
      return
    }
    setPreviewUrl(url)
  }

  const handleClose = () => setPreviewUrl(null)

  const getDownloadUrl = (url: string) => url

  const filteredPdfs = pdfs.filter(pdf =>
    (pdf.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <SidebarInset>
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2 md:gap-3">
              <SidebarTrigger />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                My PDFs
              </h2>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search PDFs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={loadingFiles}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {loadingFiles ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-blue-600 text-lg font-medium">Loading files...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Upload Card */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 p-6 cursor-pointer transition group min-h-[240px]"
                onClick={() => document.getElementById('pdf-upload')?.click()}
                role="button"
                tabIndex={0}
              >
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={e => handleFileUpload(e.target.files)}
                  disabled={uploading}
                />
                <FilePlus className="w-12 h-12 text-blue-600 group-hover:scale-105 transition mb-2" />
                <h3 className="text-lg font-medium text-blue-700 mb-1">
                  {uploading ? 'Uploading...' : 'Add PDF'}
                </h3>
                <p className="text-sm text-blue-400">
                  {uploading ? 'Please wait...' : 'Click to select or drop PDF here.'}
                </p>
              </div>

              {/* PDFs */}
              {filteredPdfs.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <File className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? 'No PDFs found' : 'No PDFs yet'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery
                      ? 'Try a different search term'
                      : 'Upload your first PDF to get started'}
                  </p>
                </div>
              ) : (
                filteredPdfs.map(pdf => (
                  <div
                    key={pdf.id}
                    className="relative group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col min-h-[240px]"
                  >
                    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border-b border-gray-200 dark:border-gray-700">
                      {pdf.url ? (
                        <iframe
                          src={`https://docs.google.com/gview?url=${encodeURIComponent(pdf.url)}&embedded=true`}
                          title="PDF preview"
                          className="w-full h-32"
                          loading="lazy"
                        />
                      ) : (
                        <img
                          src="/pdf-thumbnail.png"
                          alt={pdf.name}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() => handlePreview(pdf.url)}
                          className="p-1 bg-white shadow-sm rounded hover:bg-gray-100 transition"
                          title="Full Preview"
                          disabled={!pdf.url}
                          aria-label="Preview"
                        >
                          <Eye className="w-4 h-4 text-gray-700" />
                        </button>
                        <a
                          href={pdf.url ? getDownloadUrl(pdf.url) : '#'}
                          download={pdf.url ? pdf.name : undefined}
                          className={`p-1 bg-white rounded hover:bg-gray-100 transition-colors ${!pdf.url && 'opacity-60 pointer-events-none'
                            }`}
                          title="Download"
                          aria-label="Download"
                        >
                          <Download className="w-4 h-4 text-gray-700" />
                        </a>
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-medium text-base mb-1 truncate" title={pdf.name}>
                        {pdf.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span>{(pdf.size / (1024 * 1024)).toFixed(2)} MB</span>
                        <span>{new Date(pdf.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(pdf.id)}
                        className="w-full mt-auto flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </SidebarInset>
      <Dialog open={!!previewUrl} onOpenChange={handleClose}>
        <DialogHeader className="px-4 mt-2">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            PDF Preview
          </DialogTitle>
        </DialogHeader>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
          {previewUrl && (
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
              className="w-full h-full"
              title="PDF Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
