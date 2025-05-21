import React from 'react'
import Image from 'next/image'
// import logo from '@/images/dashboardpic.png'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotesCard(props: any) {
  // console.log(props)
  return (
    <div>
    <Card>
    <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription className='text-xs'>{props.description}</CardDescription>
    </CardHeader>
    <CardContent>
        <div className="relative border p-2 rounded overflow-hidden w-full h-40"> {/* Must have fixed height */}
        <Image
          src={props.imgData}
          alt="Note image"
          fill
          className="object-contain "
          />
        </div>
    </CardContent>
    <CardFooter>
        <Button className='bg-red-500 hover:bg-red-400 duration-150 cursor-pointer'><Trash/></Button>
    </CardFooter>
    </Card>
    </div>
  )
}
