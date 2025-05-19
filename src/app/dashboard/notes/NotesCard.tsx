import React from 'react'
import Image from 'next/image'
import logo from '@/images/dashboardpic.png'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotesCard() {
  return (
    <div>
    <Card>
    <CardHeader>
        <CardTitle>Note Title</CardTitle>
        <CardDescription>Note Description</CardDescription>
    </CardHeader>
    <CardContent>
        <Image src={logo} alt='' />
    </CardContent>
    <CardFooter>
        <Button className='bg-red-500 hover:bg-red-400 duration-150 cursor-pointer'><Trash/></Button>
    </CardFooter>
    </Card>
    </div>
  )
}
