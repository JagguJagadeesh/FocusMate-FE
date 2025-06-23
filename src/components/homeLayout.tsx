'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import EmblaCarousel from './myui/EmblaCarousel'
import { EmblaOptionsType } from 'embla-carousel'
import ReviewLayout from './review-layout'
import FooterLayout from './footerLayout'
import { motion } from 'framer-motion'
import { Sparkles, Clock, CheckCircle } from 'lucide-react'

const OPTIONS: EmblaOptionsType = { loop: true }
const SLIDES = Array.from(Array(4).keys())

const featureList = [
  {
    icon: <Sparkles className="w-8 h-8 text-blue-600" />,
    title: 'AI-Powered Planning',
    description: 'Generate study plans tailored to your deadlines and strengths.',
  },
  {
    icon: <Clock className="w-8 h-8 text-purple-600" />,
    title: 'Focus Timer & Analytics',
    description: 'Boost productivity with Pomodoro sessions and session insights.',
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-green-600" />,
    title: 'Progress Tracking',
    description: 'Track your goals, tasks, and streaks as you improve.',
  },
]

function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between mt-20 px-6 lg:px-12 gap-12">
        <motion.div
          className="flex flex-col gap-4 w-full lg:w-1/2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Your Personal Study Planner, Reinvented
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Welcome to <strong>FocusMate</strong> — your smart study companion. Let us help you achieve more in less time with AI-powered productivity tools.
          </p>
          <Button
            className="relative group mt-4 w-fit px-16 py-6 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-500 overflow-hidden"
          >
            <Link href="/auth/signup" className="relative z-10">
              Get Started
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        </motion.div>
      </div>

      {/* Features */}
      <motion.section
        className="mt-24 px-6 lg:px-20 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-8">Why FocusMate?</h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
          {featureList.map((f, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-md border flex flex-col items-center text-center gap-3 hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
            >
              {f.icon}
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="mt-28 px-6 lg:px-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
          {[
            {
              title: '1. Create a Study Plan',
              desc: 'Set your goals and deadlines. Let FocusMate create a personalized study roadmap.',
            },
            {
              title: '2. Focus with Timer',
              desc: 'Use Pomodoro or custom focus sessions to stay productive.',
            },
            {
              title: '3. Track & Improve',
              desc: 'Visualize your progress, streaks, and daily productivity metrics.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-muted p-6 rounded-xl shadow">
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.div
        className="mt-28 px-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-medium mb-6">What Our Users Say</h2>
        <ReviewLayout />
      </motion.div>

      {/* CTA Banner */}
      <motion.section
        className="mt-32 mx-4 px-6 xl:px-20 py-12 text-center bg-gradient-to-tr from-pink-600 to-purple-600 text-white rounded-3xl"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Focus Better?</h2>
        <p className="text-lg sm:text-xl mb-6">
          Join thousands of learners using FocusMate to smash their goals.
        </p>
        <Link href="/auth/signup">
          <Button className="bg-white text-blue-700 px-8 py-5 text-lg hover:bg-gray-100">
            Get Started for Free
          </Button>
        </Link>
      </motion.section>

      {/* Footer */}
      <div className="mt-24">
        <FooterLayout />
      </div>
    </div>
  )
}

export default HomeLayout
