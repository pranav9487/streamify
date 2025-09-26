import { VideoIcon } from 'lucide-react'
import React from 'react'

const CallButton = ({handleVideoCall}) => {
  return (
    <div className='flex items-center justify-end  p-3 max-w-7xl mx-auto w-full absolute top-0'>
        <button onClick={handleVideoCall} className='btn btn-success btn-sm text-white'>
            <VideoIcon className='size-6'/>
        </button>

    </div>
  )
}

export default CallButton