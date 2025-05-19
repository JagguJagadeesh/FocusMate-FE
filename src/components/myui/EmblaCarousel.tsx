'use client'
import React, { useRef } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useAutoplay } from './EmblaCarouselAutoplay'
import { useAutoplayProgress } from './EmblaCarouselAutoplayProgress'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import Image from 'next/image'
import dashbordpic from '@/images/dashboardpic.png'
import schdulepic from '@/images/schdulepic.png'
import chatbotpic from '@/images/chatbotpic.png'
import analyticpic from '@/images/analyticspic.png'

const images = [dashbordpic, schdulepic, chatbotpic, analyticpic];


type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const progressNode = useRef<HTMLDivElement>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: false, delay: 3000 })
  ])

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } =
    useAutoplay(emblaApi)

  const { showAutoplayProgress } = useAutoplayProgress(emblaApi, progressNode)

  return (
    <div className="relative w-full overflow-hidden">
    <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex w-full">
        {slides.map((index) => (
            <div
            className="flex-[0_0_100%] flex justify-center items-center h-80 border rounded-lg border-gray-300"
            key={index}
            >
            <span className="text-3xl font-bold"><Image objectFit='cover' src={images[index]} alt=''/></span>
            </div>
        ))}
        </div>
    </div>

    {/* Controls */}
    <div className="flex items-center justify-between gap-4 mt-4">
        <div className="flex gap-2">
        <PrevButton
            onClick={() => onAutoplayButtonClick(onPrevButtonClick)}
            disabled={prevBtnDisabled}
        />
        <NextButton
            onClick={() => onAutoplayButtonClick(onNextButtonClick)}
            disabled={nextBtnDisabled}
        />
        </div>

        {/* Progress bar */}
        <div
        className={`relative h-1 w-20 overflow-hidden rounded-full border transition-opacity duration-300 ease-in-out ${
            showAutoplayProgress ? 'opacity-100' : 'opacity-0'
        }`}
        >
        <div
            ref={progressNode}
            className="absolute top-0 left-[-100%] bottom-0 w-full bg-gray-800 animate-[autoplay-progress_3s_linear_1]"
        />
        </div>

        <button
        onClick={toggleAutoplay}
        type="button"
        className="px-4 py-1 text-sm font-semibold rounded-full border text-gray-800 hover:bg-gray-100"
        >
        {autoplayIsPlaying ? 'Stop' : 'Start'}
        </button>
    </div>
    </div>

  )
}

export default EmblaCarousel
