'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@/components/ui/card'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import useUserStore from '@/stores/useUserStore'
import Image from 'next/image'
import logo from '@/lib/logo.png'

function Profile() {
  const user = useUserStore(s=>s.user)
  return (
    <div className='w-full h-full flex flex-col items-center justify-between'>
        <Card className="w-full max-w-sm h-full bg-none shadow-none border-none">
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>
          {user.email}
        </CardDescription>
        <CardAction>
          <Avatar>
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        </CardAction>
      </CardHeader>
      <Separator/>
      <CardContent>
        <div className='w-full flex items-center justify-around gap-3 border rounded'>
            <div className='flex flex-col items-center justify-center border-r p-5'>
                <p className='text-2xl'>45</p>
                <p className='text-gray-500 text-xs'>Post</p>
            </div>
            <div className='flex flex-col items-center justify-center border-r p-5'>
                <p className='text-2xl'>12</p>
                <p className='text-gray-500 text-xs'>Projects</p>
            </div>
            <div className='flex flex-col items-center justify-center p-5'>
                <p className='text-2xl'>124</p>
                <p className='text-gray-500 text-xs'>Likes</p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className='w-full'>
            <p className='text-2xl mb-3'>My Progress</p>
            <Progress value={66}/>
        </div>
      </CardFooter>
    </Card>
    <div className=''>
      <Image className='rounded-lg w-48 h-14 m-4' src={logo} alt={''} />
    </div>
    </div>
  )
}

export default Profile