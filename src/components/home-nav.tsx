'use client'
import logo from '@/lib/logo.png'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import { ModeToggle } from './theme-button'


function HomeNav() {
  return (
    <div className='flex py-4 mx-auto mt-6 items-center space-x-50'>
        <div className='cursor-pointer'>
          <Link  href='/'><Image src={logo} width={200} height={200} className='rounded' alt='logo'/></Link>
        </div>
        <div>
          <ul className='flex gap-6 items-center text-lg font-medium font-mono'>
            <Link href={'#'}><li className='hover:underline cursor-pointer duration-150 text-md'>Home</li></Link>
            <Link href={'#'}><li className='hover:underline cursor-pointer duration-150 text-md'>About</li></Link>
            <Link href={'/community'}><li className='hover:underline cursor-pointer duration-150 text-md'>Community</li></Link>
            <Link href={'#'}><li className='hover:underline cursor-pointer duration-150 text-md'>Contact</li></Link>
          </ul>
        </div>
        <div className='flex items-center gap-6 '>
          <div className='flex items-center gap-2 rounded-md border text-lg border-gray-400 pl-3'>
          <Link href='/auth/signin'>SignIn</Link>
          <Link href='auth/signup'><Button className=' text-md rounded-l-none cursor-pointer'>SignUp</Button></Link>
          </div>
          <ModeToggle/>
        </div>
    </div>
  )
}

export default HomeNav