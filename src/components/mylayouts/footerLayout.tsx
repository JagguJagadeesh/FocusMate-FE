import React from 'react'
import ProductLogo from '../ProductLogo'
import Link from 'next/link'
import { Github, Twitter, Mail } from 'lucide-react'

function FooterLayout() {
  return (
    <footer className='bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Single Row Layout */}
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
          {/* Left: Logo & Copyright */}
          <div className='flex items-center gap-8'>
            <ProductLogo />
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              © 2025 FocusMate
            </p>
          </div>

          {/* Center: Quick Links */}
          <nav className='flex flex-wrap justify-center gap-6'>
            {['Features', 'Pricing', 'About', 'Contact', 'Privacy'].map((item) => (
              <Link 
                key={item}
                href='#' 
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right: Social Icons */}
          <div className='flex gap-3'>
            {[
              { icon: Twitter, href: 'https://github.com/JagguJagadeesh/FocusMate-FE' },
              { icon: Github, href: 'https://github.com/JagguJagadeesh/FocusMate-FE' },
              { icon: Mail, href: 'https://github.com/JagguJagadeesh/FocusMate-FE' }
            ].map((social, i) => (
              <Link 
                key={i}
                href={social.href}
                className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all'
              >
                <social.icon className='w-4 h-4' />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterLayout
