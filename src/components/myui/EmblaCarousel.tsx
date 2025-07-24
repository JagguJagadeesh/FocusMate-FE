'use client'
import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useAutoplay } from './EmblaCarouselAutoplay'
import {
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import dashbordpic from '@/images/dashboardpic.png'
import schdulepic from '@/images/schdulepic.png'
import chatbotpic from '@/images/chatbotpic.png'
import analyticpic from '@/images/analyticspic.png'

const images = [dashbordpic, schdulepic, chatbotpic, analyticpic]
const imageLabels = ['Dashboard', 'Schedule', 'AI Chatbot', 'Analytics']

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: true, delay: 4000 })
  ])

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const { onAutoplayButtonClick, autoplayIsPlaying, toggleAutoplay } = useAutoplay(emblaApi)

  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on('select', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  return (
    <div className="w-full h-full">
      {/* Main Carousel Container */}
      <div className="relative h-full">
        {/* Carousel Viewport */}
        <div 
          className="overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 h-full" 
          ref={emblaRef}
        >
          <div className="flex h-full">
            {slides.map((index) => (
              <div
                className="flex-[0_0_100%] relative h-full"
                key={index}
              >
                {/* Image Container */}
                <div className="relative h-[280px] sm:h-[320px] lg:h-[360px]">
                  <Image
                    src={images[index]}
                    alt={imageLabels[index]}
                    fill
                    className="object-cover object-center rounded-2xl"
                    priority={index === 0}
                  />
                  
                  {/* Simple Label */}
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {imageLabels[index]}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Only show on hover */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button
            className={`
              absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-auto
              w-8 h-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg
              flex items-center justify-center text-gray-600 dark:text-gray-400
              hover:bg-white dark:hover:bg-gray-800 transition-all duration-200
              ${prevBtnDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
            `}
            onClick={() => onAutoplayButtonClick(onPrevButtonClick)}
            disabled={prevBtnDisabled}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            className={`
              absolute right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-auto
              w-8 h-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg
              flex items-center justify-center text-gray-600 dark:text-gray-400
              hover:bg-white dark:hover:bg-gray-800 transition-all duration-200
              ${nextBtnDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
            `}
            onClick={() => onAutoplayButtonClick(onNextButtonClick)}
            disabled={nextBtnDisabled}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Compact Controls */}
      <div className="flex items-center justify-between mt-3 px-1">
        {/* Dot Indicators */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`
                w-1.5 h-1.5 rounded-full transition-all duration-200
                ${index === selectedIndex 
                  ? 'bg-blue-500 w-4' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }
              `}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>

        {/* Compact Controls */}
        <div className="flex items-center gap-2">
          {/* Autoplay Control */}
          <button
            onClick={toggleAutoplay}
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs text-gray-700 dark:text-gray-300 transition-colors"
          >
            {autoplayIsPlaying ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
          </button>

          {/* Slide Counter */}
          <div className="text-xs text-gray-500 dark:text-gray-400 min-w-[30px]">
            {selectedIndex + 1}/{slides.length}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel
