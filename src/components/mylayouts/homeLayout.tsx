'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import EmblaCarousel from '../myuicomponents/EmblaCarousel'
import FooterLayout from './footerLayout'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Users, TrendingUp, Award, BookOpen, Target,
  Timer,
  PenTool,
  Calendar,
  FileText,
  Youtube
} from 'lucide-react'
import useUserStore from '@/stores/useUserStore'

const SLIDES = Array.from(Array(6).keys())

const featureList = [
  {
    icon: <Timer className="w-6 h-6" />,
    title: 'Pomodoro Focus Timer',
    description: 'Built-in timer with break reminders and productivity analytics to track your deep work sessions.',
    color: 'from-blue-500 to-cyan-500',
    stat: '85% focus improvement'
  },
  {
    icon: <PenTool className="w-6 h-6" />, // Excalidraw icon
    title: 'Visual Note Taking',
    description: 'Draw diagrams, mind maps, and visual notes directly in your study space with Excalidraw integration.',
    color: 'from-purple-500 to-pink-500',
    stat: 'Unlimited canvases'
  },
  {
    icon: <Youtube className="w-6 h-6" />,
    title: 'YouTube Study Playlists',
    description: 'Organize educational videos by subject and track what you\'ve watched without leaving your study flow.',
    color: 'from-red-500 to-orange-500',
    stat: 'Save 2hrs/week'
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Smart Day Scheduler',
    description: 'AI-powered daily planning that adapts to your energy levels and upcoming deadlines.',
    color: 'from-green-500 to-emerald-500',
    stat: '90% task completion'
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'PDF Library Manager',
    description: 'Store, organize, and annotate textbooks, research papers, and study materials in one place.',
    color: 'from-indigo-500 to-blue-500',
    stat: 'Unlimited storage'
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Books & Resources Hub',
    description: 'Curated collection of textbooks, guides, and learning resources categorized by subject.',
    color: 'from-amber-500 to-yellow-500',
    stat: '1000+ resources'
  }
]


function HomeLayout() {

  const { user } = useUserStore()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">

      {/* Hero Section */}
      <section id='home' className="relative mt-8 pt-28 pb-20 px-6 md:px-20 max-w-full mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Column - Content */}
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col text-center lg:text-left space-y-6">
              <h1 className="text-5xl font-semibold leading-[1.15] tracking-tight max-w-3xl mx-auto lg:mx-0">
                Your Personal Study Planner,{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Achieve More
                </span>
              </h1>

              <p className="text-lg tracking-wide  text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Organize tasks, track progress, and beat procrastination with smart reminders. Study smarter, stay consistent, and achieve your goals faster.
              </p>
            </div>

            {/* CTA Buttons */}
            {user.id ? 
            <div className="w-full flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
              <Link href="/dashboard">
                <Button className="group h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                  Start Focusing
                </Button>
              </Link>
            </div> : 
            <div className="w-full flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
              <Link href="/auth/signup">
                <Button className="group h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                  Get Started Free
                </Button>
              </Link>
            </div>}
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
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-3xl blur-2xl"></div>

              {/* Main Visual Container */}
              <div className="relative bg-white dark:bg-gray-900  rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-lg">
                <EmblaCarousel slides={SLIDES} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className="py-24 px-6">
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
          {/* <ReviewLayout /> */}
        </div>
      </section>

      {/* FAQ Section */}
      <section id='qna' className="py-24 px-6 bg-gray-50 dark:bg-gray-900/20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to know about FocusMate
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {[
              {
                q: 'Is FocusMate really free?',
                a: 'Yes! FocusMate offers a free plan with core features including the Pomodoro timer, basic note-taking, and day scheduling. Premium features like unlimited PDF storage and AI study plans are available with our Pro plan.'
              },
              {
                q: 'Do I need to download any software?',
                a: 'No downloads required! FocusMate is a fully web-based platform that works directly in your browser. Access your study materials from any device, anywhere, anytime.'
              },
              {
                q: 'Can I use FocusMate on mobile devices?',
                a: 'Absolutely! FocusMate is fully responsive and works seamlessly on smartphones and tablets. Study on-the-go with the same features you love on desktop.'
              },
              {
                q: 'How does the Pomodoro timer work?',
                a: 'Our smart timer uses the proven Pomodoro Technique: 25-minute focused study sessions followed by 5-minute breaks. After 4 sessions, take a longer 15-30 minute break. The timer tracks your productivity and provides insights.'
              },
              {
                q: 'Is my study data private and secure?',
                a: 'Your privacy is our priority. All data is encrypted end-to-end, and we never share your personal information or study materials with third parties. You have full control over your data.'
              },
              {
                q: 'Can I collaborate with study groups?',
                a: 'Yes! Share notes, schedules, and resources with classmates. Create study groups, set shared goals, and track collective progress together.'
              }
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.q}
                  </h3>
                  <svg
                    className="w-5 h-5 text-blue-600 transform group-open:rotate-180 transition-transform duration-300 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center p-8 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Still have questions? We&apos;re here to help!
            </p>
            <Link href="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-xl">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* Footer */}
      <FooterLayout />
    </div>
  )
}

export default HomeLayout
