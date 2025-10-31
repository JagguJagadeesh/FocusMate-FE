'use client'
import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import dashbordpic from '@/images/dashboardpic.png'
import schdulepic from '@/images/schdulepic.png'
import chatbotpic from '@/images/chatbotpic.png'
import analyticpic from '@/images/analyticspic.png'
import playlistpic from '@/images/playlistpic.png'
import focuspic from '@/images/focuspic.png'
import notespic from '@/images/notespic.png'



const images = [
  dashbordpic,
  focuspic,
  notespic,
  playlistpic,
  schdulepic,
  chatbotpic,
  analyticpic
]

const imageLabels = [
  'Dashboard',
  'Focus Timer',
  'Visual Notes',
  'Video Playlists',
  'Day Scheduler',
  'AI Assistant',
]

const imageDescriptions = [
  'Your central hub for all study activities',
  'Stay focused with Pomodoro technique',
  'Draw diagrams and mind maps instantly',
  'Organize educational videos by subject',
  'Smart scheduling that adapts to you',
  'AI-powered help whenever you need it',
]

type PropType = {
  slides: number[]
}

const EmblaCarousel: React.FC<PropType> = ({ slides }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const goToNext = () => {
    setSelectedIndex((prev) => (prev + 1) % slides.length)
  }


  React.useEffect(() => {
    const timer = setInterval(goToNext, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[400px] rounded-3xl overflow-hidden group">
      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={images[selectedIndex]}
            alt={imageLabels[selectedIndex]}
            fill
            className="object-fill"
            priority={selectedIndex === 0}
          />
          {/* Light overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" /> */}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 ">
        <motion.div
          key={`content-${selectedIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-black mb-1 max-w-lg">
            {imageLabels[selectedIndex]}
          </h3>

          <p className="text-black/90 text-base sm:text-lg max-w-lg">
            {imageDescriptions[selectedIndex]}
          </p>
        </motion.div>
      </div>

      {/* Dots - Bottom Right */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`h-2 rounded-full transition-all ${index === selectedIndex
              ? 'bg-black w-8'
              : 'bg-black/30 w-2 hover:bg-white/10'
              }`}
          />
        ))}
      </div>
    </div>

  )
}

export default EmblaCarousel
