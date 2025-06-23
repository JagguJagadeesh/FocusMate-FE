'use client'
import React from 'react'
import Profile from './Profile'
import { Separator } from '@/components/ui/separator'
import { Turret_Road } from 'next/font/google'
import PostsBar from './PostsBar'
import { motion } from 'framer-motion'

const geist = Turret_Road({
  subsets: ['latin'],
  weight: '400',
})

function Community() {
  return (
    <div className={`flex flex-col md:flex-row p-2 h-full md:h-screen gap-2 ${geist.className}`}>
      <motion.div
        className='w-full md:w-[20rem] rounded-2xl flex flex-col items-center'
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Profile />
      </motion.div>

      <Separator orientation='horizontal' className='md:hidden' />
      <Separator orientation='vertical' className='hidden md:block' />

      <motion.div
        className='w-full md:w-[44rem] h-fit'
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <PostsBar />
      </motion.div>

      <Separator orientation='horizontal' className='md:hidden' />
      <Separator orientation='vertical' className='hidden md:block' />

      <motion.div
        className='w-full md:w-[20rem] flex items-center justify-center text-center text-xl font-medium'
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Ratings
      </motion.div>
    </div>
  )
}

export default Community
