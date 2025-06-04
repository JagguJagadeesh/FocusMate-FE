import React from 'react'
import Profile from './Profile'
import { Separator } from '@/components/ui/separator'
import { Turret_Road } from 'next/font/google'
import PostsBar from './PostsBar'



const geist = Turret_Road({
  subsets: ['latin'],
  weight:'400',
})


function Community() {
  return (
    <div className={`flex p-2 h-screen gap-2 ${geist.className}`}>
      <div className='w-75 rounded-2xl flex flex-col items-center'>
        <Profile />
      </div>
      <Separator orientation='vertical'/>
      <div className='w-[44rem] h-fit'>
        <PostsBar />
      </div>
      <Separator orientation='vertical'/>
      <div>Ratings</div>
    </div>
  )
}

export default Community