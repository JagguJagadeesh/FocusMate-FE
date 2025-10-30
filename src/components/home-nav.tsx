'use client'

import { Button } from './ui/button'
import Link from 'next/link'
// import { ModeToggle } from './theme-button'
import { useState, useEffect } from 'react'
import { Menu, User, X } from 'lucide-react'
import ProductLogo from './ProductLogo'
import useUserStore from '@/stores/useUserStore'

function HomeNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useUserStore()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = () => setIsOpen(false)

  const navItems = [
    { href: '/#home', label: 'Home' },
    { href: '/#features', label: 'Features' },
    { href: '/#qna', label: 'Quations' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className={`fixed top-2 left-2 right-2 z-50 transition-all duration-300 ${scrolled ? 'top-2' : ''
        }`}>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg px-4 sm:px-6'>
            <div className='flex items-center justify-between h-16'>

              {/* Logo */}
              <Link href='/' className='cursor-pointer flex items-center'>
                <ProductLogo />
              </Link>

              {/* Desktop Navigation */}
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

              {/* Desktop Actions */}
              <div className='hidden md:flex items-center gap-2'>
                {user.id ? (
                  <Link href='/user/profile' className='p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl'>
                    <User className='w-5 h-5' />
                  </Link>
                ) : (
                  <>
                    <Link href='/auth/signin'>
                      <Button variant='ghost' className='rounded-xl cursor-pointer'>Sign in</Button>
                    </Link>
                    <Link href='/auth/signup'>
                      <Button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white cursor-pointer rounded-xl'>
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
                {/* <ModeToggle /> */}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className='md:hidden p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg'
              >
                {isOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn'
            onClick={closeMobileMenu}
          />

          {/* Slide Menu */}
          <div className='md:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 animate-slideInRight'>
            <div className='flex flex-col h-full'>
              {/* Header */}
              <div className='w-full flex items-center justify-between pl-6 py-4 border-b border-gray-200 dark:border-gray-800'>
                <ProductLogo />
                <button
                  onClick={closeMobileMenu}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer rounded-lg transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>

              {/* Navigation */}
              <div className='flex-1 overflow-y-auto p-6 space-y-2'>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className='block px-4 py-3 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition-all'
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Footer Actions */}
              <div className='p-6 border-t border-gray-200 dark:border-gray-800 space-y-3'>
                {user.id ? (
                  <Link href='/user/profile' onClick={closeMobileMenu}>
                    <Button variant='outline' className='w-full cursor-pointer h-12 rounded-xl'>
                      <User className='w-4 h-4 mr-2' /> Profile
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href='/auth/signin' onClick={closeMobileMenu}>
                      <Button variant='outline' className='w-full cursor-pointer mb-3 h-12 rounded-xl'>
                        Sign in
                      </Button>
                    </Link>
                    <Link href='/auth/signup' onClick={closeMobileMenu}>
                      <Button className='w-full h-12 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl'>
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

    </>
  )
}

export default HomeNav
