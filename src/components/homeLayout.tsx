'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import EmblaCarousel from './myui/EmblaCarousel'
import { EmblaOptionsType } from 'embla-carousel'
import ReviewLayout from './review-layout'
import FooterLayout from './footerLayout'
import { motion } from 'framer-motion'
import {
  Sparkles, CheckCircle, Shield, Zap,
  Users, TrendingUp, Award, BookOpen, Target, Brain,
  Timer, BarChart3, ChevronRight, Quote
} from 'lucide-react'

const OPTIONS: EmblaOptionsType = { loop: true }
const SLIDES = Array.from(Array(4).keys())

const featureList = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI Study Plans',
    description: 'Personalized study schedules that adapt to your learning style and deadlines.',
    color: 'from-blue-500 to-cyan-500',
    stat: '2x faster learning'
  },
  {
    icon: <Timer className="w-6 h-6" />,
    title: 'Smart Focus Timer',
    description: 'Advanced Pomodoro sessions with analytics to maximize your concentration.',
    color: 'from-purple-500 to-pink-500',
    stat: '85% productivity boost'
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Progress Analytics',
    description: 'Detailed insights into your study habits and academic performance.',
    color: 'from-green-500 to-emerald-500',
    stat: '90% goal completion'
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Medical Student, Harvard",
    text: "FocusMate helped me increase my study efficiency by 40%. The AI planning is incredible!",
    rating: 5,
    image: "/api/placeholder/40/40"
  },
  {
    name: "Marcus Johnson",
    role: "Engineering Student, MIT",
    text: "From struggling with time management to acing my exams. This tool is a game-changer.",
    rating: 5,
    image: "/api/placeholder/40/40"
  }
]

function HomeLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 md:px-10 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Column - Content */}
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col text-center lg:text-left space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight max-w-3xl mx-auto lg:mx-0">
                Your Personal Study Planner,{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Achieve More
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Organize tasks, track progress, and beat procrastination with smart reminders.
                Study smarter, stay consistent, and achieve your goals faster.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
              <Link href="/auth/signup">
                <Button className="group h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                  Start Learning Today
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="relative">
              {/* Layered Glow Effects */}
              <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/25 to-purple-500/25 rounded-3xl blur-3xl"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-3xl blur-2xl"></div>

              {/* Main Visual Container */}
              <div className="relative bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-lg">
                <EmblaCarousel slides={SLIDES} options={OPTIONS} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Mini Testimonials */}
      <section className="py-16 px-6 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-4">
                  <Quote className="w-8 h-8 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 italic">&quot;{testimonial.text}&ldquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
              <Sparkles className="w-4 h-4" />
              Powerful Features
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything you need to
              <br />
              <span className="text-blue-600">excel academically</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Scientifically-proven tools designed to maximize your learning potential
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {featureList.map((feature, i) => (
              <motion.div
                key={i}
                className="group relative bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:-translate-y-3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Icon */}
                <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Stat */}
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                  {feature.stat}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/20">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Get started in
              <span className="text-purple-600"> under 2 minutes</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple setup, powerful results. Start your academic transformation today.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Set Your Goals',
                desc: 'Tell us your subjects, deadlines, and learning preferences. Our AI analyzes your needs instantly.',
                icon: <Target className="w-8 h-8" />,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '02',
                title: 'Get Your Plan',
                desc: 'Receive a personalized study schedule optimized for your success, updated in real-time.',
                icon: <BookOpen className="w-8 h-8" />,
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '03',
                title: 'Track & Succeed',
                desc: 'Monitor your progress, celebrate achievements, and watch your grades improve consistently.',
                icon: <Award className="w-8 h-8" />,
                color: 'from-green-500 to-emerald-500'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="relative text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Connection Line */}
                {i < 2 && (
                  <div className="hidden lg:block absolute top-12 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500"></div>
                )}

                {/* Icon Container */}
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${item.color} rounded-3xl text-white mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>

                {/* Step Number */}
                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                  Step {item.step}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-full text-sm font-medium text-green-700 dark:text-green-300 mb-8">
              <Users className="w-4 h-4" />
              Join The Community
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Trusted by students at
              <span className="text-green-600"> top universities</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
              From Harvard to MIT, students are achieving their academic dreams with FocusMate
            </p>
          </motion.div>
          <ReviewLayout />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >

            {/* Content */}
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Ready to 10x your
                <br />
                academic performance?
              </h2>

              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join 50,000+ successful students who&apos;ve transformed their study habits and achieved their dreams
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/signup">
                  <Button className="h-14 px-10 bg-white text-blue-600 hover:bg-gray-50 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group">
                    Start Your Free Account Now
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-white/20">
                <div className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Free Forever Plan</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Bank-Level Security</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">Instant Setup</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <FooterLayout />
    </div>
  )
}

export default HomeLayout
