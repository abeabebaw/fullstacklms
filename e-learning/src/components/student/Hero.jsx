import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from'../../components/student/SearchBar'



function Hero() {
  return (
   
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 text-center bg-gradient-to-b from-cyan-100/70'>
      <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-grary-800 max-w-3xl mx-auto'>Learn the Skills of Tomorrow, <span className='text-blue-600'>Stay ahead in a rapidly changing world with future-proof education.</span><img src={assets.sketch} alt="sketch" className='md:block hidden absolute-bottom-7 right-0' /> </h1>
      
      <p className='md:block hidden text-gray-500 max-w-2xl mx-auto '>Join our community of learners and educators to unlock your potential and achieve your goals. Explore our courses, connect with experts, and take the first step towards a brighter future.</p>
      <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>From foundational knowledge to advanced specialization, we guide every step of your educational journey with adaptive learning technology, expert mentorship, and career-focused curriculum.</p>
      <div className='w-full md:mt-10 mt-5 mb-5'>
      <SearchBar />
      </div>

      
    </div>
    
  )
}

export default Hero