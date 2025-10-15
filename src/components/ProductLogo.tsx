'use client'
import { Roboto_Flex } from "next/font/google";
import { GraduationCap } from 'lucide-react'

const globalFont = Roboto_Flex({
    weight:['400'],
    subsets:['latin']
});

function ProductLogo() {
  return (
    <>
    <div className='flex items-center justify-around space-x-1'>
    <GraduationCap width={40} height={40}/>
    <h1 className={`text-2xl font-extrabold tracking-wider pt-1 ${globalFont.className}`}>Focus
      <span className="bg-gradient-to-r from-violet-400 via-purple-600 to-pink-600 bg-clip-text text-transparent">Mate</span>
    </h1>
    </div>
    </>
  )
}

export default ProductLogo