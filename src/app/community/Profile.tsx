'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import useUserStore from '@/stores/useUserStore'
import Image from 'next/image'
import logo from '@/lib/logo.png'
import { motion } from 'framer-motion'

function Profile() {
  const user = useUserStore(s => s.user)

  return (
    <motion.div
      className='w-full h-full flex flex-col items-center justify-between'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-sm bg-transparent shadow-none border-none">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
          <CardAction>
            <Avatar>
              <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </CardAction>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className='w-full flex items-center justify-around gap-3 border rounded py-2'>
            <div className='flex flex-col items-center border-r px-4'>
              <p className='text-2xl'>45</p>
              <p className='text-gray-500 text-xs'>Posts</p>
            </div>
            <div className='flex flex-col items-center border-r px-4'>
              <p className='text-2xl'>12</p>
              <p className='text-gray-500 text-xs'>Projects</p>
            </div>
            <div className='flex flex-col items-center px-4'>
              <p className='text-2xl'>124</p>
              <p className='text-gray-500 text-xs'>Likes</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className='w-full'>
            <p className='text-xl mb-2'>My Progress</p>
            <Progress value={66} />
          </div>
        </CardFooter>
      </Card>
      <Image className='rounded-lg w-36 h-12 m-4 object-contain' src={logo} alt="logo" />
    </motion.div>
  )
}

export default Profile
