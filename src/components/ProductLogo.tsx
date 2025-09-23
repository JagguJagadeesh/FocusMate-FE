'use client'
import { Chewy } from "next/font/google";
import { GraduationCap } from 'lucide-react'

const globalFont = Chewy({
    weight:['400'],
});

function ProductLogo() {
  return (
    <div className=''>
    <div className='flex items-center justify-around space-x-1'>
    <GraduationCap width={40} height={40}/>
    <h1 className={`text-2xl font-extrabold tracking-wider pt-1 ${globalFont.className}`}>FocusMate</h1>
    </div>
    </div>
  )
}

export default ProductLogo