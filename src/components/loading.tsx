import React from 'react'
import { Skeleton } from './ui/skeleton'

function loading() {
  return (
    <div className='w-full h-full flex items-center justify-center'>
        <div className='flex space-x-4'>
        <div className="flex flex-col space-y-3">
        <Skeleton className="h-60 w-[300px] rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
        </div>
        <div className='flex flex-col space-y-10 mt-4'>
        <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
        </div>
        <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
        </div>
        <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
        </div>
        </div>
        </div>
    </div>
  )
}

export default loading