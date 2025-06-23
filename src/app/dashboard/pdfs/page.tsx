'use client'

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { FileText } from 'lucide-react'

const samplePDFs = [
  { name: 'Resume.pdf', size: '120 KB' },
  { name: 'Project Report.pdf', size: '1.2 MB' },
  { name: 'Syllabus.pdf', size: '450 KB' },
]

export default function MyPDFsPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 items-center gap-2 px-4 border-b bg-background/80 backdrop-blur">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" /> My PDFs
        </h2>
      </header>

      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {samplePDFs.map((pdf, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white dark:bg-zinc-900 p-4 shadow hover:shadow-md transition-all"
          >
            <h3 className="text-md font-semibold">{pdf.name}</h3>
            <p className="text-sm text-muted-foreground">{pdf.size}</p>
          </div>
        ))}
      </main>
    </SidebarInset>
  )
}
