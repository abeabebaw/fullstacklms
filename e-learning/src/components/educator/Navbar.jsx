import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

const Navbar = ({ onToggleSidebar }) => {
  const educatorData = dummyEducatorData
  const { user } = useUser() || {}

  const displayName = (user?.fullName ?? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()) || 'Developer'

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 border-b border-gray-200 bg-white/95 backdrop-blur-sm py-4 shadow-sm">
        {/* Logo Section */}
        <Link 
          to="/" 
          aria-label="Go to home"
          className="transition-transform hover:scale-105 active:scale-95 duration-200"
        >
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src={assets.logo}
                alt="BIRUHAMIRO Logo"
                className="w-10 h-10 md:w-12 md:h-12 object-contain transition-all duration-300 group-hover:rotate-6"
              />
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-sm group-hover:bg-blue-500/20 transition-colors"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                BIRUHAMIRO
              </h1>
              <p className="text-xs text-gray-500 font-medium">E-LEARNING PLATFORM</p>
            </div>
          </div>
        </Link>

        {/* Navigation Section */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Greeting with subtle animation */}
          <div className="hidden md:block">
            <p className="text-sm text-gray-600">
              Welcome back, 
              <span className="font-semibold text-gray-800 ml-1 px-2 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                {displayName}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Create Quiz Button - Primary Action */}
            <Link 
              to="/educator/create-quiz" 
              className="group relative flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-xl"></div>
              <PlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative">Create Quiz</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-4 h-0.5 bg-white/50 rounded-full transition-all duration-300"></div>
            </Link>
            
            {/* My Quizzes Button - Secondary Action */}
            <Link 
              to="/educator/my-quizzes" 
              className="group relative flex items-center gap-2 text-sm font-medium bg-white text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 active:bg-gray-100"
            >
              <DocumentTextIcon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span className="relative">My Quizzes</span>
              {/* Optional badge for quiz count - you can add logic later */}
              <span className="ml-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                {educatorData?.quizzes?.length || 0}
              </span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-4 h-0.5 bg-blue-500/30 rounded-full transition-all duration-300"></div>
            </Link>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button for future responsiveness */}
            <button 
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menu"
              onClick={onToggleSidebar}
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1">
                <div className="w-full h-0.5 bg-gray-600 rounded"></div>
                <div className="w-full h-0.5 bg-gray-600 rounded"></div>
                <div className="w-full h-0.5 bg-gray-600 rounded"></div>
              </div>
            </button>
            
            {/* User Profile/Button */}
            <div className="relative group">
              {user ? (
                <div className="p-1 rounded-full hover:bg-blue-50 transition-colors">
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-9 h-9 md:w-10 md:h-10 border-2 border-white shadow-md hover:border-blue-200 transition-all duration-300"
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="relative group">
                  <img 
                    src={assets.profile_img} 
                    alt="Profile" 
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-white shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer"
                  />
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              )}
              {/* Profile tooltip */}
              <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap">
                {displayName}
                <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar