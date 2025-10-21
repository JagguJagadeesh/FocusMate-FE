import React from 'react'
import ProductLogo from './ProductLogo'
import Link from 'next/link'
import { Github, Phone } from 'lucide-react'

function footerLayout() {
  return (
    <footer className='border-t border-neutral-200 bg-neutral-50 mt-12'>
      <div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
          {/* Logo and Copyright Section */}
          <div className='flex flex-col items-center md:items-start space-y-3'>
            <div className='flex items-center'>
              <ProductLogo/>
            </div>
            <p className='text-sm text-neutral-600 text-center md:text-left'>
              Copyright © 2025 FocusMate. All rights reserved.
            </p>
          </div>

          {/* Action Links Section */}
          <div className='flex gap-3'>
            <Link 
              className='flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg transition-all duration-200 hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5' 
              href={'#'}
            >
              <Phone className='w-4 h-4' />
              <span className='hidden sm:inline'>Contact Us</span>
            </Link>
            <Link 
              className='flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg transition-all duration-200 hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5' 
              href={'#'}
            >
              <Github className='w-4 h-4' />
              <span className='hidden sm:inline'>Help Us</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default footerLayout
