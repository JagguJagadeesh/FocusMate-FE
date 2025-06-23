'use client'

import logo from '@/lib/logo.png'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import { ModeToggle } from './theme-button'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

function HomeNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className='w-full px-4 py-4 mt-6'>
      <div className='flex items-center justify-between max-w-7xl mx-auto'>
        {/* Logo */}
        <Link href='/' className='flex items-center'>
          <Image src={logo} width={150} height={150} className='rounded' alt='logo' />
        </Link>

        {/* Desktop Menu */}
        <ul className='hidden md:flex gap-6 items-center text-lg font-medium font-mono'>
          <Link href='/'><li className='hover:underline cursor-pointer'>Home</li></Link>
          <Link href='/community'><li className='hover:underline cursor-pointer'>Community</li></Link>
          <Link href='/contact'><li className='hover:underline cursor-pointer'>Contact</li></Link>
        </ul>

        {/* Desktop Auth + Theme Toggle */}
        <div className='hidden md:flex items-center gap-6'>
          <div className='flex items-center gap-2 rounded-md border text-lg border-gray-400 pl-3'>
            <Link href='/auth/signin'>SignIn</Link>
            <Link href='/auth/signup'>
              <Button className='text-md rounded-l-none'>SignUp</Button>
            </Link>
          </div>
          <ModeToggle />
        </div>

        {/* Mobile Hamburger */}
        <button className='md:hidden' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
        </button>
      </div>

      {/* Dropdown for Mobile */}
      {isOpen && (
        <div className='md:hidden mt-2 px-2 py-3 border rounded-md shadow bg-white dark:bg-black space-y-4 transition-all duration-300'>
          <ul className='flex flex-col gap-3 text-base font-mono'>
            <Link href='/' onClick={() => setIsOpen(false)}><li>Home</li></Link>
            <Link href='#' onClick={() => setIsOpen(false)}><li>About</li></Link>
            <Link href='/community' onClick={() => setIsOpen(false)}><li>Community</li></Link>
            <Link href='/contact' onClick={() => setIsOpen(false)}><li>Contact</li></Link>
          </ul>
          <div className='pt-2 border-t'>
            <div className='flex flex-col gap-2 pt-2'>
              <Link href='/auth/signin' onClick={() => setIsOpen(false)}>SignIn</Link>
              <Link href='/auth/signup' onClick={() => setIsOpen(false)}>
                <Button className='w-full'>SignUp</Button>
              </Link>
              <div className='pt-2'><ModeToggle /></div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default HomeNav
