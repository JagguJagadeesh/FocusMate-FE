"use client";

import { Button } from './ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LayoutDashboard, Menu, User, X, Home, HelpCircle, Mail, ChevronDown, Moon, Sun } from 'lucide-react'
import ProductLogo from './ProductLogo'
import useUserStore from '@/stores/useUserStore'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes';

function HomeNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const { user } = useUserStore()
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = () => setIsOpen(false)

  const navItems = [
    { href: '/#home', label: 'Home', icon: Home },
    { href: '/#features', label: 'Features', icon: Mail },
    { href: '/#qna', label: 'Questions', icon: HelpCircle },
    { href: '/contact', label: 'Contact', icon: Mail },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <nav className={`fixed top-3 left-2 right-2 z-50 transition-all duration-300`}>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg px-4 sm:px-6'>
            <div className='flex items-center justify-between h-16'>

              <Link href='/' className='cursor-pointer flex items-center'>
                <ProductLogo />
              </Link>

              <div className='hidden md:flex items-center space-x-2'>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className='px-4 py-2 cursor-pointer text-md font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all'
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className='hidden md:flex items-center gap-3'>
                {/* Dark Mode Toggle Button */}
                {isHydrated && (
                  <motion.button
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300'
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <Sun className='w-5 h-5 text-yellow-500' />
                    ) : (
                      <Moon className='w-5 h-5 text-gray-700' />
                    )}
                  </motion.button>
                )}

                {!isHydrated ? (
                  <div className='flex items-center gap-3'>
                    <div className='h-11 w-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse' />
                    <div className='h-11 w-28 bg-violet-200 dark:bg-violet-900 rounded-xl animate-pulse' />
                  </div>
                ) : user.id ? (
                  <div className='relative'>
                    <motion.button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className='flex items-center cursor-pointer gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all'
                    >
                      <div className='w-5 h-5 cursor-pointer bg-white/20 rounded-lg flex items-center justify-center'>
                        <User className='w-4 h-4' />
                      </div>
                      <span className='text-sm'>Profile</span>
                      <motion.div
                        animate={{ rotate: dropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className='w-4 h-4' />
                      </motion.div>
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          onClick={() => setDropdownOpen(false)}
                          className='absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50'
                        >
                          {/* Header */}
                          <div className='px-4 py-3 bg-gradient-to-r from-violet-50 to-violet-100 dark:from-violet-900/30 dark:to-violet-900/20 border-b border-gray-200 dark:border-gray-800'>
                            <p className='text-sm font-semibold text-gray-900 dark:text-white'>Account</p>
                            <p className='text-xs text-gray-600 dark:text-gray-400 truncate'>{user.email}</p>
                          </div>

                          {/* Dashboard Link */}
                          <Link
                            href='/dashboard'
                            onClick={() => setDropdownOpen(false)}
                            className='block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors border-b border-gray-200 dark:border-gray-800'
                          >
                            <div className='flex items-center gap-3'>
                              <LayoutDashboard className='w-4 h-4 text-violet-600' />
                              <span className='text-sm font-medium'>Dashboard</span>
                            </div>
                          </Link>

                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <Link href='/auth/signin'>
                      <Button variant='outline' className='rounded-xl cursor-pointer'>
                        Sign in
                      </Button>
                    </Link>
                    <Link href='/auth/signup'>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className='bg-violet-600 hover:bg-violet-700 text-white cursor-pointer rounded-xl shadow-lg'>
                          Get Started
                        </Button>
                      </motion.div>
                    </Link>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className='md:hidden p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
              >
                {isOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className='md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40'
            />

            {/* Slide Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='md:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50'
            >
              <div className='flex flex-col h-full'>

                {/* Header */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className='w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800'
                >
                  <span className='text-lg font-bold text-gray-900 dark:text-white'>Menu</span>
                  <div className='flex items-center gap-2'>
                    {/* Mobile Dark Mode Toggle */}
                    {isHydrated && (
                      <motion.button
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all'
                        aria-label="Toggle theme"
                      >
                        {theme === 'dark' ? (
                          <Sun className='w-5 h-5 text-yellow-500' />
                        ) : (
                          <Moon className='w-5 h-5 text-gray-700' />
                        )}
                      </motion.button>
                    )}
                    <motion.button
                      onClick={closeMobileMenu}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
                    >
                      <X className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                    </motion.button>
                  </div>
                </motion.div>

                {/* User Profile Section */}
                {isHydrated && user.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className='px-6 py-4 bg-gradient-to-r from-violet-50 to-violet-100 dark:from-violet-900/30 dark:to-violet-900/20 border-b border-gray-200 dark:border-gray-800'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center text-white font-bold text-sm'>
                        {user.email?.[0].toUpperCase()}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-semibold text-gray-900 dark:text-white truncate'>
                          {user.email?.split('@')[0]}
                        </p>
                        <p className='text-xs text-gray-600 dark:text-gray-400 truncate'>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Items */}
                <motion.div
                  className='flex-1 overflow-y-auto px-3 py-6'
                  variants={containerVariants}
                  initial='hidden'
                  animate={isHydrated ? 'visible' : 'hidden'}
                >
                  <div className='space-y-2'>
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <motion.div key={item.href}>
                          <Link
                            href={item.href}
                            onClick={closeMobileMenu}
                            className='flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl transition-colors font-medium'
                          >
                            <Icon className='w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0' />
                            <span>{item.label}</span>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Footer Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className='border-t border-gray-200 dark:border-gray-800 p-4 space-y-3'
                >
                  {!isHydrated ? (
                    <div className='space-y-2'>
                      <div className='h-11 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
                      <div className='h-11 bg-violet-200 dark:bg-violet-900 rounded-lg animate-pulse' />
                    </div>
                  ) : user.id ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45 }}
                    >
                      <Link href='/dashboard' onClick={closeMobileMenu} className='block'>
                        <Button className='w-full h-11 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium shadow-lg'>
                          <LayoutDashboard className='w-4 h-4 mr-2' />
                          Dashboard
                        </Button>
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial='hidden'
                      animate='visible'
                      className='space-y-2'
                    >
                      <motion.div>
                        <Link href='/auth/signin' onClick={closeMobileMenu} className='block'>
                          <Button
                            variant='outline'
                            className='w-full h-11 rounded-lg border-2 font-medium'
                          >
                            Sign in
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div>
                        <Link href='/auth/signup' onClick={closeMobileMenu} className='block'>
                          <Button className='w-full h-11 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium shadow-lg'>
                            Get Started Free
                          </Button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default HomeNav
