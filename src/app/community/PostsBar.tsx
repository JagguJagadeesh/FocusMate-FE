'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { motion } from 'framer-motion'

const posts = [
  {
    title: "Tranquil Forest Walk",
    image: "https://picsum.photos/id/1018/800/600",
    description: "A peaceful path through lush green woods."
  },
  {
    title: "City Skyline",
    image: "https://picsum.photos/id/1015/800/600",
    description: "Downtown skyscrapers shining in the evening light."
  },
  {
    title: "Rustic Cabin Retreat",
    image: "https://picsum.photos/id/1020/800/600",
    description: "A cozy cabin in the heart of the wilderness."
  },
  {
    title: "Ocean Breeze",
    image: "https://picsum.photos/id/1025/800/600",
    description: "Waves crashing under the warm sunset glow."
  },
  {
    title: "Adventurous Ride",
    image: "https://picsum.photos/id/1035/800/600",
    description: "Exploring the desert on four wheels."
  }
]

function PostsBar() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Posts</h1>
      <ScrollArea className="h-[33rem] w-full rounded-md">
        <div className="p-2 flex flex-col gap-4">
          {posts.map((item, index) => (
            <motion.div
              key={index}
              className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-neutral-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
            >
              <img
                className="w-full h-60 object-cover"
                src={item.image}
                alt={item.title}
                loading="lazy"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
              </div>
              <Separator className="my-2" />
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default PostsBar
