import React from 'react'
import { LoaderIcon } from 'react-hot-toast'

const ChatLoader = () => {
  return (
    <div className='h-screen flex flex-col justify-center items-center p-4'>
        <LoaderIcon className='animate-spin size-10 text-primary'/>
        <p className='mt-4 text-center text-lg font-mono'>
            connecting to chat...
        </p>

    </div>
  )
}

export default ChatLoader