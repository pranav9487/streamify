import { BellIcon } from 'lucide-react'
import React from 'react'

const NoNotifications = () => {
  return (
    <div className='flex flex-col items-center mt-8 space-y-2' >
        <div className='size-16 bg-accent-content rounded-full flex justify-center items-center'>
            <BellIcon className='text-base-content opacity-40'/>
        </div>
        <h3 className='text-center text-secondary text-lg font-semibold'>No Notifications Yet</h3>
        <p className='text-secondary opacity-70 text-sm max-w-md'> When you receive friend request or messages, They will appear here </p>
    </div>
  )
}

export default NoNotifications