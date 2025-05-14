import React from 'react'
import Friends from './Friends'
import Navbar from './Navbar'
import MobileNav from './MobileNav'

const MobileFriends = () => {
  return (
    <div className='bg-gray-100 h-screen' >
        <Navbar />
        <div className='p-5'>

        <Friends />
        </div>
        <MobileNav />
    </div>
  )
}

export default MobileFriends