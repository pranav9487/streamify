import React from 'react'
import {LANGUAGE_TO_FLAG} from '../constants/index.js'
import {Link} from 'react-router'
export const FriendCard = ({friend}) => {
  return (
    <div className='card bg-base-200 hover:shadow-md transition-shadow '>
        <div className="p-4 card-body">
            {/* USER INFO */}
            <div className='flex items-center gap-3 mb-3'>
                <div className='size-12 avatar rounded-full overflow-hidden'>
                <img src={friend.profilePic} alt="user avatar" />
                </div>
                <h3 className='font-semibold truncate'>{friend.fullName}</h3>
            </div>
            <div className='flex flex-wrap gap-1 mb-3'>
                <span className="badge badge-secondary text-xs">
                    {getLanguageFlag(friend.nativeLanguage)}
                    Native: {friend.nativeLanguage}
                </span>
                <span className="badge badge-outline text-xs">
                    {getLanguageFlag(friend.learningLanguage)}
                    Learning: {friend.learningLanguage}
                </span>
            </div>
            <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
            Message
            </Link>
        </div>
    </div>
  )
}


export function getLanguageFlag(language) {
    if(!language){
        return null
    }
    const langLower = language.toLowerCase()
    const countryCode = LANGUAGE_TO_FLAG[langLower];
   if(countryCode){
    
     return (  <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt={`${language} country flag`}
         className='h-3 inline-block mr-1' />
        )
   }
   return null
}