'use client'
import logo from '@/lib/logo.png'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'


function HomeNav() {
  return (
    <div className='flex py-4 mx-auto mt-6 items-center'>
        <div className='mr-96'>
            <Image src={logo} width={200} height={200} className='rounded' alt='logo'/>
        </div>
        <div>
            <ul className='flex gap-4 items-center text-md font-medium font-mono'>
                <li>WhyFocusMate</li>
                <li>Contact</li>
                <Link href='/auth/signin'><li>Login</li></Link>
                <Link href='auth/signup'><li><Button>Lest`s Start</Button></li></Link>
            </ul>
        </div>
    </div>
  )
}

export default HomeNav