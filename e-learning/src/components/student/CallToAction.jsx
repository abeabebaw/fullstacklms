import React from 'react'
import { assets } from '../../assets/assets'

function CallToAction() {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 px-8 pb-24 md:px-0'>
      <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'> learn anything  ,anytime ,anywhere</h1>
      <p className='text-gray-500 sm:text-sm'> Stop following random tutorials. This is a structured, project-based program with 1-on-1 mentorship and a job guarantee.</p>
              <div className=' flex items-center font-medium gap-6 mt-4'> 
                <button className='px-10 py-3 rounded-full bg-blue-500 text-white'>Get Started</button>
      <button className='flex items-center gap-2 '>learn more <img  className='' src={assets.arrow_icon} alt="" /></button>
                              </div> 
    </div>
  )
}

export default CallToAction