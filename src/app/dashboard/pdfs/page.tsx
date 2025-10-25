'use client'

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import React, { useState } from 'react'
import { Upload, File, Trash2, Download, Eye, Search, X } from 'lucide-react'

function Page() {
  const [pdfs, setPdfs] = useState([
    // Example data - replace with your actual data
    {
      id: '1',
      name: 'React Cheat Sheet.pdf',
      size: '2.4 MB',
      uploadedAt: '2025-10-20',
      url: 'https://example.com/pdf1.pdf',
      thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&q=80'
    },
    {
      id: '2',
      name: 'JavaScript Notes.pdf',
      size: '1.8 MB',
      uploadedAt: '2025-10-22',
      url: 'https://example.com/pdf2.pdf',
      thumbnail: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=200&q=80'
    }
  ])
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dragActive, setDragActive] = useState(false)
  console.log(pdfs)

  // Cloudinary upload function
  const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'your_upload_preset') // Replace with your preset
    formData.append('resource_type', 'raw') // For PDFs

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/your_cloud_name/raw/upload`, // Replace with your cloud name
        {
          method: 'POST',
          body: formData
        }
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const handleFileUpload = async (files) => {
    setUploading(true)

    try {
      const file = files[0]

      // Upload to Cloudinary
      const cloudinaryResponse = await uploadToCloudinary(file)

      // Add to state
      const newPdf = {
        id: cloudinaryResponse.public_id,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        uploadedAt: new Date().toISOString().split('T')[0],
        url: cloudinaryResponse.secure_url,
        thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&q=80'
      }

      setPdfs([newPdf, ...pdfs])
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload PDF. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this PDF?')) {
      // Delete from Cloudinary
      // You'll need a backend endpoint for this
      // For now, just remove from state
      setPdfs(pdfs.filter(pdf => pdf.id !== id))
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === 'application/pdf') {
        handleFileUpload([file])
      } else {
        alert('Please upload PDF files only')
      }
    }
  }

  const filteredPdfs = pdfs.filter(pdf =>
    pdf.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <SidebarInset>
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  My PDFs
                </h2>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search PDFs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </header>
      </SidebarInset>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 mb-8 transition-all ${dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
              : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-1">
                {uploading ? 'Uploading...' : 'Upload PDF Files'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag and drop your PDFs here, or click to browse
              </p>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
                disabled={uploading}
              />
              <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Upload className="w-4 h-4" />
                Choose File
              </span>
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total PDFs</div>
            <div className="text-2xl font-bold">{pdfs.length}</div>
          </div> */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Size</div>
            <div className="text-2xl font-bold">
              {pdfs.reduce((acc, pdf) => acc + parseFloat(pdf.size), 0).toFixed(1)} MB
            </div>
          </div>
        </div>

        {/* PDF Grid */}
        {filteredPdfs.length === 0 ? (
          <div className="text-center py-12">
            <File className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No PDFs found' : 'No PDFs yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try a different search term' : 'Upload your first PDF to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                  <img
                    src={pdf.thumbnail}
                    alt={pdf.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => window.open(pdf.url, '_blank')}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5 text-gray-700" />
                    </button>
                    <a
                      href={pdf.url}
                      download
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5 text-gray-700" />
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-2 truncate" title={pdf.name}>
                    {pdf.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>{pdf.size}</span>
                    <span>{pdf.uploadedAt}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(pdf.id)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Page
