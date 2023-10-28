import React from 'react'
import { Skeleton } from './ui/skeleton'

const WelcomeMsgFallback = () => {
  return (
    <div className='flex w-full mb-12'>
      <h1 className='text-4xl font-bold'>
        <Skeleton className='w-32 h-9' />
        <Skeleton className='w-56 h-9' />
      </h1>
    </div>
  )
}

export default WelcomeMsgFallback