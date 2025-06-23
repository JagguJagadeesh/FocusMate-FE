'use client'

import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteNote } from '@/services/userService'
import { toast } from 'sonner'

interface NotesCardProps {
  id: string
  title: string
  description: string
  imgData: string
  onDelete?: (id: string) => void
}

export default function NotesCard({ id, title, description, imgData, onDelete }: NotesCardProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNote(id)
      toast.success("Note deleted successfully!")
      window.location.reload()
      if (onDelete) onDelete(id)
    } catch (error) {
      toast.error("Failed to delete note.")
      console.error(error)
    }
  }

  return (
    <Card className="cursor-pointer border shadow-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="truncate">Title : <span className='text-yellow-500'>{title}</span></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-36 border rounded overflow-hidden">
          {imgData ? (
            <Image
              src={imgData}
              alt="Note image"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">No Image</div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-400 ml-auto">
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
