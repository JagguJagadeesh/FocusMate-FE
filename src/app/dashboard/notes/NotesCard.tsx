'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteNote } from '@/services/userService'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


interface NotesCardProps {
  id: string
  title: string
  description: string
  imgData: string
}

export default function NotesCard({ id, title, description, imgData }: NotesCardProps) {
  // const router = useRouter()
  const handleDelete = async () => {
    try {
      const res = await deleteNote(id)
      toast.success("Note deleted successfully!")
      // router.refresh()
      window.location.reload()
    } catch (error) {
      toast.error("Failed to delete note.")
      console.error(error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className='text-xs'>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative border p-2 rounded overflow-hidden w-full h-40">
          <Image
            src={imgData}
            alt="Note image"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleDelete} className='bg-red-500 hover:bg-red-400 duration-150'>
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
