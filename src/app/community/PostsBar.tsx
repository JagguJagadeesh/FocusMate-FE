import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import React from 'react'


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
];


function PostsBar() {
  return (
    <div >
      <div>
        <p className='text-3xl mb-2'>Posts</p>
      </div>
      <ScrollArea className="h-[33rem] w-full rounded-md ">
      <div className="p-4">
        {posts.map((item,index) => 
          <React.Fragment key={index}>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img className="w-full h-72 object-cover" src={item.image} alt="Post"/>
            <div className="p-4">
                <h2 className="text-xl font-semibol mb-2">{item.title}</h2>
                <p className="text-sm">
                {item.description}
                </p>
            </div>
            </div>
            <Separator className="my-2" />
          </React.Fragment>
        )}
      </div>
    </ScrollArea>
    </div>
  )
}

export default PostsBar