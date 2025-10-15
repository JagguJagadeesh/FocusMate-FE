'use client'

import { Button } from './ui/button'
import Link from 'next/link'
import { ModeToggle } from './theme-button'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import ProductLogo from './ProductLogo'
import useUserStore from '@/stores/useUserStore'

function HomeNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useUserStore()


  // Simple scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu
  const closeMobileMenu = () => setIsOpen(false)

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/community', label: 'Community' },
    { href: '/contact', label: 'Contact' },
    { href: '/helpus', label: 'Help Us' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 shadow-sm transition-all duration-300 ${scrolled
        ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl '
        : 'bg-transparent'
      }`}>
      <div className='flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-1 lg:px-3 h-16'>

        {/* Logo */}
        <Link href='/' className='flex items-center mb-1'>
          <ProductLogo />
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center space-x-8'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='text-gray-700 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-700 font-bold transition-colors duration-200'
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className='hidden md:flex items-center space-x-4'>
          {user.id ? "":
          <div>
          <div className='flex items-center shadow-xs shadow-neutral-600 rounded-lg gap-3'>
            <Link
              href='/auth/signin'
              className=' pl-2 py-2 cursor-pointer'
            >
              Sign in
            </Link>

            <Link href='/auth/signup' className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow px-2 border-l cursor-pointer py-2 rounded-r-lg duration-150 '>
              Get started
            </Link>
          </div>
          </div>}
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        >
          {isOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-950 border-b shadow-lg'>
          <div className='px-6 py-4 space-y-4'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className='block py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-center hover:shadow-lg rounded-lg'
              >
                {item.label}
              </Link>
            ))}

            <div className='pt-4 border-t flex flex-col space-y-3'>
              
              {user.id ? "" :<div>
              <Link
                href='/auth/signin'
                onClick={closeMobileMenu}
                className='block py-2 text-center text-gray-700 dark:text-gray-300'
              >
                Sign in
              </Link>

              <Link href='/auth/signup' onClick={closeMobileMenu}>
                <Button className='w-full bg-gray-900 text-white py-2'>
                  Get started
                </Button>
              </Link>
              </div>}

              <div className='flex justify-center'>
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default HomeNav
