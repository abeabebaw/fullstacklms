import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const location = useLocation();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  console.log(user);

  const isCourseListPage = location.pathname.includes('/course-list');

  return (
    <div className={`flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 xl:px-36 py-3 sm:py-4 border-b border-gray-300 ${isCourseListPage ? 'bg-white shadow-md rounded-lg mb-4 sm:mb-6' : 'bg-cyan-100/70'}`}>
      <div className='flex items-center justify-between w-full'>
        {/* Logo Section */}
        <div className='flex-shrink-0'>
          <img 
            src={assets.logo} 
            alt="Company Logo" 
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 cursor-pointer rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-4 lg:gap-6 text-gray-600'>
          {user && (
            <>
              <button className='hover:text-blue-600 transition-colors duration-200 text-sm lg:text-base font-medium px-3 py-2 rounded-lg hover:bg-blue-50'>
                Become Educator
              </button>
              <span className='text-gray-300'>|</span>
              <Link 
                to='/my-enrollments' 
                className='hover:text-blue-600 transition-colors duration-200 text-sm lg:text-base font-medium px-3 py-2 rounded-lg hover:bg-blue-50'
              >
                My Enrollments
              </Link>
            </>
          )}
        </div>
        
        {/* Desktop Authentication Section */}
        <div className='hidden md:block'>
          {user ? (
            <div className='flex items-center gap-4'>
              <UserButton />
            </div>
          ) : (
            <button 
              onClick={() => openSignIn()} 
              className='bg-blue-600 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm lg:text-base font-medium shadow-md hover:shadow-lg transform hover:scale-105'
            >
              Create Account
            </button>
          )}
        </div>
        
        {/* Mobile Navigation */}
        <div className='md:hidden flex items-center gap-3 sm:gap-4'>
          {user ? (
            // Mobile - User is logged in
            <div className='flex items-center gap-2 sm:gap-3'>
              <Link 
                to='/my-enrollments' 
                className='text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium bg-white/80 px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-sm'
              >
                My Courses
              </Link>
              <button className='text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium bg-white/80 px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-sm'>
                Educator
              </button>
              <div className='ml-1 sm:ml-2'>
                <UserButton />
              </div>
            </div>
          ) : (
            // Mobile - User is logged out
            <div className='flex items-center gap-2 sm:gap-3'>
              <button 
                onClick={() => openSignIn()} 
                className='bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 text-xs sm:text-sm font-medium shadow-md flex items-center gap-1'
              >
                <span>Sign In</span>
              </button>
              <button className='text-gray-600 hover:text-blue-600 transition-colors duration-200'>
                <img 
                  src={assets.user_icon} 
                  alt="User menu" 
                  className='w-6 h-6 sm:w-7 sm:h-7'
                  
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;