'use client'

import logo from '@/lib/logo.png'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import { ModeToggle } from './theme-button'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

function HomeNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) setIsOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/community', label: 'Community' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        ${scrolled
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800'
          : 'bg-transparent'
        }
      `}
    >
      <div className='flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        {/* Logo */}
        <Link href='/' className='flex items-center group'>
          <div className='relative overflow-hidden rounded-xl'>
            <Image
              src={logo}
              width={150}
              height={150}
              className='rounded-xl transition-transform duration-300 group-hover:scale-105'
              alt='logo'
            />
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className='hidden md:flex items-center space-x-8'>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className='
                  relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                  font-medium text-lg transition-colors duration-200
                  after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 
                  after:bg-gradient-to-r after:from-blue-500 after:to-purple-600
                  after:transition-all after:duration-300 hover:after:w-full
                '
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth + Theme Toggle */}
        <div className='hidden md:flex items-center space-x-4'>
          <div className='flex items-center rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-800/50 shadow-sm'>
            <Link
              href='/auth/signin'
              className='
      px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 
      hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700
      transition-all duration-200 flex items-center justify-center min-w-[70px]
    '
            >
              Sign In
            </Link>
            <div className='w-px h-6 bg-gray-300 dark:bg-gray-600'></div>
            <Link href='/auth/signup'>
              <button
                className='
        rounded-l-none rounded-r-lg bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 
        hover:from-blue-600 hover:to-purple-700 text-white border-0
        shadow-md hover:shadow-lg transition-all duration-200 px-5 py-2.5
        hover:scale-105 active:scale-95
      '
              >
                Sign Up
              </button>
            </Link>
          </div>

          <div className='p-1'>
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className='
            md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 
            hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200
          '
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          aria-label="Toggle menu"
        >
          <div className='relative w-6 h-6'>
            <Menu
              className={`
                absolute inset-0 w-6 h-6 transition-all duration-300 
                ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}
              `}
            />
            <X
              className={`
                absolute inset-0 w-6 h-6 transition-all duration-300 
                ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}
              `}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 z-40
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Dropdown Menu */}
      <div
        className={`
          md:hidden absolute top-full left-4 right-4 mt-2 transition-all duration-300 ease-out z-50
          ${isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='
          bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700
          overflow-hidden backdrop-blur-lg
        '>
          {/* Mobile Navigation Links */}
          <div className='px-6 py-4'>
            <ul className='space-y-3'>
              {navItems.map((item, index) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      block py-3 px-4 rounded-xl font-medium text-gray-700 dark:text-gray-300
                      hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800
                      transition-all duration-200 transform hover:translate-x-1
                      animate-in slide-in-from-left-5 fill-mode-both
                    `}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Auth Section */}
          <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'>
            <div className='space-y-3'>
              <Link
                href='/auth/signin'
                onClick={() => setIsOpen(false)}
                className='
                  block w-full py-3 px-4 text-center font-medium text-gray-700 dark:text-gray-300
                  hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700
                  rounded-xl transition-all duration-200
                '
              >
                Sign In
              </Link>
              <Link href='/auth/signup' onClick={() => setIsOpen(false)}>
                <Button
                  className='
                    w-full bg-gradient-to-r from-blue-500 to-purple-600 
                    hover:from-blue-600 hover:to-purple-700 text-white
                    shadow-md hover:shadow-lg transition-all duration-200 rounded-xl
                  '
                >
                  Sign Up
                </Button>
              </Link>
              <div className='flex justify-center pt-2'>
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default HomeNav
