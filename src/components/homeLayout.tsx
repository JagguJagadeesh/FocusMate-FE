import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import EmblaCarousel from './myui/EmblaCarousel'
import { EmblaOptionsType } from 'embla-carousel'
import ReviewLayout from './review-layout'
import FooterLayout from './footerLayout'



const OPTIONS: EmblaOptionsType = { loop: true }
const SLIDES = Array.from(Array(4).keys());

function HomeLayout() {
  return (
    <div>
        <div className='flex mt-14'>
            <div className='flex flex-col gap-3 w-1/2 p-10'>
                <p className='text-4xl font-medium font-mono mb-4'>Your Personal Study Planner, Reinvented</p>
                <p className='text-xl '>Welcome to FocusMate — your smart study companion.</p>
                <p className='text-sm'>Whether you`re preparing for exams, managing class deadlines, or just trying to stay productive, FocusMate helps you create personalized study plans, track progress, and stay focused using AI-powered insights and reminders.</p>
                <Link href='/auth/signup'><Button className='px-18 py-6 mt-2'>Get Started</Button></Link>
            </div>
            <div className='w-1/2 p-4'>
                <EmblaCarousel  slides={SLIDES} options={OPTIONS} />
            </div>
        </div>
        <div className='mt-20 p-4 flex flex-col items-center justify-center'>
          <p className='text-3xl mb-5'>Testimonials</p>
          <ReviewLayout />
        </div>
        <div className='border-t-gray-400 mx-4 mt-6 border-t'>
          <FooterLayout />
        </div>
    </div>
  )
}

export default HomeLayout