'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin,
  Github,
  Heart,
  ArrowUp,
  Send,
  BookOpen,
  Clock,
  BarChart3,
  MessageCircle
} from 'lucide-react'
import { Button } from './ui/button'

const footerSections = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '/features', icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Pricing', href: '/pricing', icon: <BarChart3 className="w-4 h-4" /> },
      { name: 'AI Study Planner', href: '/ai-planner', icon: <Clock className="w-4 h-4" /> },
      { name: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-4 h-4" /> },
      { name: 'Mobile App', href: '/mobile', icon: <Phone className="w-4 h-4" /> },
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Help Center', href: '/help', icon: <MessageCircle className="w-4 h-4" /> },
      { name: 'Study Guides', href: '/guides', icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Blog', href: '/blog', icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Community', href: '/community', icon: <MessageCircle className="w-4 h-4" /> },
      { name: 'API Docs', href: '/api', icon: <Github className="w-4 h-4" /> },
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about', icon: <Heart className="w-4 h-4" /> },
      { name: 'Careers', href: '/careers', icon: <MapPin className="w-4 h-4" /> },
      { name: 'Contact', href: '/contact', icon: <Mail className="w-4 h-4" /> },
      { name: 'Press Kit', href: '/press', icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Partners', href: '/partners', icon: <Heart className="w-4 h-4" /> },
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy', icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Terms of Service', href: '/terms', icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Cookie Policy', href: '/cookies', icon: <BookOpen className="w-4 h-4" /> },
      { name: 'GDPR', href: '/gdpr', icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Security', href: '/security', icon: <BookOpen className="w-4 h-4" /> },
    ]
  }
]

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/focusmate', icon: <Twitter className="w-5 h-5" />, color: 'hover:text-blue-400' },
  { name: 'Facebook', href: 'https://facebook.com/focusmate', icon: <Facebook className="w-5 h-5" />, color: 'hover:text-blue-600' },
  { name: 'Instagram', href: 'https://instagram.com/focusmate', icon: <Instagram className="w-5 h-5" />, color: 'hover:text-pink-500' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/focusmate', icon: <Linkedin className="w-5 h-5" />, color: 'hover:text-blue-700' },
  { name: 'GitHub', href: 'https://github.com/focusmate', icon: <Github className="w-5 h-5" />, color: 'hover:text-gray-900 dark:hover:text-white' },
]

export default function FooterLayout() {
  const [email, setEmail] = React.useState('')
  const [showScrollTop, setShowScrollTop] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  return (
    <footer className="relative bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="inline-flex items-center group">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    FocusMate
                  </div>
                </Link>
                
                <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
                  Your AI-powered study companion that helps you achieve more in less time. Join thousands of learners who have transformed their productivity with FocusMate.
                </p>

                {/* Newsletter Subscription */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Stay Updated
                  </h4>
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <Button 
                      type="submit"
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 group"
                    >
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </form>
                </div>

                {/* Contact Info */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:hello@focusmate.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      hello@focusmate.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <a href="tel:+1234567890" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      +1 (234) 567-8900
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {footerSections.map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <Link 
                            href={link.href}
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
                          >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                              {link.icon}
                            </span>
                            <span className="group-hover:translate-x-1 transition-transform duration-200">
                              {link.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <motion.div 
              className="text-sm text-gray-600 dark:text-gray-400 text-center lg:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              © {new Date().getFullYear()} 
              <Link href="/" className="mx-1 font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                FocusMate
              </Link>
              All rights reserved. Made with 
              <Heart className="inline w-4 h-4 mx-1 text-red-500" />
              for learners worldwide.
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 text-gray-500 dark:text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg group`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div 
            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-500">
              <div className="flex flex-wrap items-center gap-4">
                <span>🔒 SSL Secured</span>
                <span>🚀 99.9% Uptime</span>
                <span>🌍 Global CDN</span>
                <span>📱 Mobile Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Powered by</span>
                <span className="font-medium text-gray-600 dark:text-gray-400">Next.js & AI</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </footer>
  )
}
