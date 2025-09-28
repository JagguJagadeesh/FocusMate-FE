

import React from 'react'
import ProductLogo from './ProductLogo'
import Link from 'next/link'
import { Separator } from './ui/separator'

function footerLayout() {
  return (
    <div className='flex flex-col items-center border-neutral-400 border-t p-8 gap-2'>
      <div><ProductLogo/></div>
      <p>Copyright © 2025 FocusMate. All rights reservered.</p>
      <div className='flex gap-4 p-3'>
        <Link className='px-2 py-0.5 rounded-lg hover:shadow-lg' href={'#'}>Contact US</Link>
        <Separator orientation='vertical' className='w-1' />
        <Link className='px-2 py-0.5 rounded-lg hover:shadow-lg' href={'#'}>Help US</Link>
      </div>
    </div>
  )
}

export default footerLayout