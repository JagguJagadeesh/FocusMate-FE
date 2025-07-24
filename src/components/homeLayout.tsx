'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import EmblaCarousel from './myui/EmblaCarousel'
import { EmblaOptionsType } from 'embla-carousel'
import ReviewLayout from './review-layout'
import FooterLayout from './footerLayout'
import { motion } from 'framer-motion'
import { Sparkles, Clock, CheckCircle, ArrowRight, Play, Shield, Zap } from 'lucide-react'

const OPTIONS: EmblaOptionsType = { loop: true }
const SLIDES = Array.from(Array(4).keys())

const featureList = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'AI-Powered Planning',
    description: 'Generate study plans tailored to your deadlines and strengths.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Focus Timer & Analytics',
    description: 'Boost productivity with Pomodoro sessions and session insights.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'Progress Tracking',
    description: 'Track your goals, tasks, and streaks as you improve.',
    color: 'from-green-500 to-emerald-500'
  },
]


function HomeLayout() {
  return (
    <div className="min-h-screen mt-4 flex flex-col overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      {/* Hero Section */}
      <div className="relative flex flex-col-reverse lg:flex-row items-center justify-between mt-20 px-6 lg:px-12 gap-12 max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col gap-6 w-full lg:w-1/2 z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
            Your Personal Study Planner,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Reinvented
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
            Welcome to <strong className="text-blue-600 dark:text-blue-400">FocusMate</strong> — your smart study companion. Let us help you achieve more in less time with AI-powered productivity tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              className="relative group px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-500 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              <Link href="/auth/signup" className="flex items-center gap-2 relative z-10">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </Button>

            <Button
              variant="outline"
              className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-300 rounded-2xl group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="w-full my-0 lg:w-1/2 relative"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative p-2 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <EmblaCarousel slides={SLIDES} options={OPTIONS} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.section
        className="relative mt-32 px-6 lg:px-20 text-center max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Why FocusMate?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            Discover the features that make studying smarter, not harder
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {featureList.map((feature, i) => (
            <motion.div
              key={i}
              className="group relative bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>

              {/* Icon */}
              <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl"></div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="relative mt-32 px-6 lg:px-20 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Three simple steps to transform your study routine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              step: '01',
              title: 'Create a Study Plan',
              desc: 'Set your goals and deadlines. Let FocusMate create a personalized study roadmap.',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              step: '02',
              title: 'Focus with Timer',
              desc: 'Use Pomodoro or custom focus sessions to stay productive.',
              color: 'from-purple-500 to-pink-500'
            },
            {
              step: '03',
              title: 'Track & Improve',
              desc: 'Visualize your progress, streaks, and daily productivity metrics.',
              color: 'from-green-500 to-emerald-500'
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Connection Line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500"></div>
              )}

              <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
                {/* Step Number */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl mb-6 text-white font-bold text-xl shadow-lg`}>
                  {item.step}
                </div>

                <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.div
        className="mt-32 px-6 text-center max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          What Our Users Say
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
          Join thousands of successful learners worldwide
        </p>
        <ReviewLayout />
      </motion.div>

      {/* CTA Banner */}
      <motion.section
        className="relative mt-32 mx-4 xl:mx-auto max-w-6xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Main Container with Softer Gradient */}
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 rounded-3xl shadow-2xl overflow-hidden">
          {/* Subtle Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-500/10 to-pink-500/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-pink-400/10 rounded-full blur-lg"></div>

          {/* Content */}
          <div className="relative z-10 px-8 xl:px-20 py-16 text-center text-white">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Join 10,000+ Active Learners</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Ready to Focus{' '}
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Better?
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-xl sm:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed text-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join thousands of learners using{' '}
              <span className="font-semibold text-blue-200">FocusMate</span>{' '}
              to smash their goals and achieve academic success.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              {/* Primary CTA */}
              <Link href="/auth/signup">
                <Button className="group relative bg-white text-gray-900 hover:bg-gray-100 px-10 py-5 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0">
                  <span className="relative z-10 flex items-center">
                    Get Started for Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                </Button>
              </Link>

              {/* Secondary CTA */}
              <Link href="/demo">
                <button
                  className="px-8 flex outline py-1 text-lg font-medium border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-2xl backdrop-blur-sm transition-all duration-300 group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-white/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Free Forever Plan</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Your Data Protected</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">Setup in 2 Minutes</span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Glow Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
        </div>
      </motion.section>


      {/* Footer */}
      <div className="mt-24 relative z-10">
        <FooterLayout />
      </div>
    </div>
  )
}

export default HomeLayout
