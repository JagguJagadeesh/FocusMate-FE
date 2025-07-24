'use client'

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Search, 
  Upload, 
  Filter,
  Download,
  Eye,
  Trash2,
  MoreVertical,
  Grid3X3,
  List,
  HardDrive,
  Calendar,
  BarChart3,
  Plus,
  CloudUpload,
  Clock,
} from 'lucide-react'
import { useState, useRef } from 'react'

const samplePDFs = [
  { 
    id: 1,
    name: 'Resume.pdf', 
    size: '120 KB',
    sizeBytes: 122880,
    uploadDate: '2024-01-15',
    category: 'Personal',
    pages: 2,
    lastOpened: '2024-01-20'
  },
  { 
    id: 2,
    name: 'Project Report.pdf', 
    size: '1.2 MB',
    sizeBytes: 1258291,
    uploadDate: '2024-01-18',
    category: 'Work',
    pages: 25,
    lastOpened: '2024-01-22'
  },
  { 
    id: 3,
    name: 'Syllabus.pdf', 
    size: '450 KB',
    sizeBytes: 460800,
    uploadDate: '2024-01-20',
    category: 'Education',
    pages: 8,
    lastOpened: '2024-01-21'
  },
  { 
    id: 4,
    name: 'Research Paper.pdf', 
    size: '2.1 MB',
    sizeBytes: 2202009,
    uploadDate: '2024-01-22',
    category: 'Academic',
    pages: 42,
    lastOpened: '2024-01-23'
  },
  { 
    id: 5,
    name: 'Invoice_2024.pdf', 
    size: '85 KB',
    sizeBytes: 87040,
    uploadDate: '2024-01-25',
    category: 'Finance',
    pages: 1,
    lastOpened: '2024-01-25'
  },
]

const categories = ['All', 'Personal', 'Work', 'Education', 'Academic', 'Finance']

const categoryConfig = {
  Personal: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  Work: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  Education: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  Academic: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  Finance: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
}

export default function MyPDFsPage() {
  const [pdfs, setPdfs] = useState(samplePDFs)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter PDFs based on search and category
  const filteredPDFs = pdfs.filter(pdf => {
    const matchesSearch = pdf.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || pdf.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate statistics
  const stats = {
    total: pdfs.length,
    totalSize: pdfs.reduce((sum, pdf) => sum + pdf.sizeBytes, 0),
    recentUploads: pdfs.filter(pdf => {
      const uploadDate = new Date(pdf.uploadDate)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return uploadDate >= weekAgo
    }).length,
    totalPages: pdfs.reduce((sum, pdf) => sum + pdf.pages, 0)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const newPDF = {
          id: pdfs.length + Math.random(),
          name: file.name,
          size: formatFileSize(file.size),
          sizeBytes: file.size,
          uploadDate: new Date().toISOString().split('T')[0],
          category: 'Personal',
          pages: Math.floor(Math.random() * 50) + 1, // Random for demo
          lastOpened: new Date().toISOString().split('T')[0]
        }
        setPdfs(prev => [...prev, newPDF])
      })
      setUploadOpen(false)
    }
  }

  const handleDelete = (id: number) => {
    setPdfs(prev => prev.filter(pdf => pdf.id !== id))
    setDeleteConfirm(null)
  }

  const handleDownload = (pdf: any) => {
    // Simulate download
    console.log(`Downloading ${pdf.name}`)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30">
      {/* Enhanced Header */}
      <SidebarInset>
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent flex items-center gap-2">
                  <FileText className="w-6 h-6 text-red-600" />
                  My PDFs
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.total} files • {formatFileSize(stats.totalSize)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search PDFs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
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

              {/* Upload Button */}
              <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 px-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                    <Upload className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    Upload PDF
                  </Button>
                </DialogTrigger>
                <UploadDialog onFileUpload={handleFileUpload} fileInputRef={fileInputRef} />
              </Dialog>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search PDFs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>
          </div>
        </header>
      </SidebarInset>

      {/* Stats Overview */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Files",
              value: stats.total,
              icon: <FileText className="w-5 h-5" />,
              color: "from-red-500 to-pink-500"
            },
            {
              label: "Storage Used",
              value: formatFileSize(stats.totalSize),
              icon: <HardDrive className="w-5 h-5" />,
              color: "from-blue-500 to-cyan-500"
            },
            {
              label: "Recent Uploads",
              value: stats.recentUploads,
              icon: <Clock className="w-5 h-5" />,
              color: "from-green-500 to-emerald-500"
            },
            {
              label: "Total Pages",
              value: stats.totalPages,
              icon: <BarChart3 className="w-5 h-5" />,
              color: "from-purple-500 to-indigo-500"
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-2 mr-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
          </div>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="h-8 px-3 rounded-lg text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* PDFs Grid/List */}
      <main className="px-6 pb-12">
        <AnimatePresence>
          {filteredPDFs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-96 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-950/30 dark:to-pink-950/30 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'No PDFs found' : 'No PDFs uploaded yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                {searchQuery 
                  ? `No PDFs match "${searchQuery}". Try adjusting your search terms.`
                  : 'Upload your first PDF to start building your document library!'
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setUploadOpen(true)}
                  className="h-12 px-8 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  Upload Your First PDF
                </Button>
              )}
            </motion.div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {filteredPDFs.map((pdf, i) => (
                <motion.div
                  key={pdf.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  layout
                >
                  <PDFCard 
                    pdf={pdf} 
                    viewMode={viewMode}
                    onDelete={() => setDeleteConfirm(pdf.id)}
                    onDownload={() => handleDownload(pdf)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete PDF?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This action cannot be undone. The PDF will be permanently removed from your library.
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
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete PDF
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// PDF Card Component
function PDFCard({ pdf, viewMode, onDelete, onDownload }) {
  return (
    <div className={`group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1 ${
      viewMode === 'list' ? 'flex items-center p-6 gap-6' : 'p-6'
    }`}>
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 via-pink-50/0 to-orange-50/0 dark:from-red-950/0 dark:via-pink-950/0 dark:to-orange-950/0 group-hover:from-red-50/30 group-hover:via-pink-50/20 group-hover:to-orange-50/30 dark:group-hover:from-red-950/20 dark:group-hover:via-pink-950/10 dark:group-hover:to-orange-950/20 transition-all duration-500 pointer-events-none" />
      
      <div className={`relative z-10 ${viewMode === 'list' ? 'flex items-center gap-6 w-full' : ''}`}>
        {/* PDF Icon */}
        <div className={`relative ${viewMode === 'list' ? 'w-12 h-16 flex-shrink-0' : 'w-full h-32 mb-4'} bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-xl overflow-hidden flex items-center justify-center`}>
          <FileText className={`${viewMode === 'list' ? 'w-6 h-6' : 'w-12 h-12'} text-red-600 dark:text-red-400`} />
          
          {/* File type indicator */}
          <div className="absolute top-2 right-2">
            <Badge className="text-xs bg-red-600 text-white px-2 py-0.5">
              PDF
            </Badge>
          </div>
        </div>

        {/* PDF Info */}
        <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`${viewMode === 'list' ? 'flex-1 mr-4' : ''}`}>
              <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300 ${
                viewMode === 'list' ? 'text-lg mb-1' : 'text-base mb-2 line-clamp-2'
              }`}>
                {pdf.name}
              </h3>
              
              {/* Category & File Info */}
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`text-xs ${categoryConfig[pdf.category]?.color || 'bg-gray-100 text-gray-800'}`}>
                  {pdf.category}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {pdf.pages} pages
                </span>
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => console.log('Preview', pdf.name)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onDelete}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* File Details */}
          <div className={`space-y-1 ${viewMode === 'list' ? 'min-w-0 flex-1' : ''}`}>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                <span>{pdf.size}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Uploaded {new Date(pdf.uploadDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 dark:text-gray-500">
              Last opened {new Date(pdf.lastOpened).toLocaleDateString()}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`flex gap-2 mt-3 ${viewMode === 'list' ? 'ml-auto' : ''}`}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => console.log('Preview', pdf.name)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 px-3 text-xs rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDownload}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 px-3 text-xs rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Border Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </div>
  )
}

// Upload Dialog Component
function UploadDialog({ onFileUpload, fileInputRef }) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  return (
    <DialogContent className="w-full max-w-lg rounded-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold flex items-center gap-2">
          <CloudUpload className="w-5 h-5 text-red-600" />
          Upload PDF Files
        </DialogTitle>
      </DialogHeader>
      
      <div className="pt-4">
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/10'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={onFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <CloudUpload className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Drop PDF files here
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                or click to browse and select files
              </p>
              
              <Button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Supported format: PDF • Max size: 10MB per file
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
