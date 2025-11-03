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

const images = [dashbordpic, focuspic, notespic, playlistpic, schdulepic, chatbotpic, analyticpic]
const imageLabels = ['Dashboard', 'Focus Timer', 'Visual Notes', 'Video Playlists', 'Day Scheduler', 'AI Assistant', 'Analytics']
const imageDescriptions = [
  'Your central hub for all study activities',
  'Stay focused with Pomodoro technique',
  'Draw diagrams and mind maps instantly',
  'Organize educational videos by subject',
  'Smart scheduling that adapts to you',
  'AI-powered help whenever you need it',
  'Track your progress and achievements'
]

type PropType = { slides: number[] }

const EmblaCarousel: React.FC<PropType> = ({ slides }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % slides.length)
  }

  React.useEffect(() => {
    const timer = setInterval(handleNext, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-auto min-h-80 sm:min-h-96 md:min-h-[480px] rounded-2xl sm:rounded-3xl flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
      <div className="relative w-56 h-64 sm:w-72 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[400px]">
        <AnimatePresence mode="popLayout">
          {slides.map((_, index) => {
            const offset = index - selectedIndex
            const isVisible = Math.abs(offset) <= 2

            if (!isVisible) return null

            return (
              <motion.div
                key={index}
                className="absolute w-full cursor-pointer"
                initial={{ scale: 0.8, rotate: -10, y: 100, opacity: 0 }}
                animate={{
                  x: offset * 40,
                  y: Math.abs(offset) * 20,
                  rotate: offset * 5,
                  scale: offset === 0 ? 1 : 0.85,
                  zIndex: 10 - Math.abs(offset),
                  opacity: offset === 0 ? 1 : 0.6,
                }}
                exit={{ scale: 0.8, rotate: 10, y: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
                onClick={() => offset !== 0 && setSelectedIndex(index)}
              >
                {/* Polaroid frame */}
                <div className="bg-white dark:bg-gray-900 p-3 sm:p-4 shadow-lg sm:shadow-xl md:shadow-2xl rounded-lg">
                  <div className="relative w-full aspect-square sm:aspect-video bg-gray-100 dark:bg-gray-800 mb-2 sm:mb-4">
                    <Image
                      src={images[index]}
                      alt={imageLabels[index]}
                      fill
                      className="object-fill"
                      priority={selectedIndex === 0}
                    />
                  </div>
                  <div className="text-center px-1">
                    <h3 className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                      {imageLabels[index]}
                    </h3>
                    {offset === 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs sm:text-sm text-gray-600 dark:text-gray-400"
                      >
                        {imageDescriptions[index]}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`rounded-full transition-all ${index === selectedIndex ? 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-800 dark:bg-white scale-125' : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gray-400 dark:bg-gray-600'
              }`}
          />
        ))}
      </div>
    </div>
  )
}

export default EmblaCarousel
