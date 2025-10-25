import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/educator/Sidebar'

const Navbar = () => {
  const educatorData = dummyEducatorData
  const { user } = useUser() || {}

  const displayName = (user?.fullName ?? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()) || 'Developer'

  return (<>
   <header className="flex items-center justify-between px-4 md:px-8 border-b border-gray-200 py-12 bg-cyan-100/70">
  <Link to="/" aria-label="Go to home">
    <div className="flex items-center gap-3">
      <img
        src={assets.logo}
        alt="BIRUHAMIRO Logo"
        className="w-12 h-12 object-contain"
      />
      <h1 className="text-xl font-semibold text-blue-800">
        BIRUHAMIRO E-LEARNING
      </h1>
    </div>
  </Link>

  <div className="flex items-center gap-4 text-gray-700">
    <p className="text-sm">Hi, <span className="font-medium">{displayName}</span></p>
    {user ? (
      <UserButton />
    ) : (
      <img src={assets.profile_img} alt="profile" className="w-8 h-8 rounded-full object-cover" />
    )}
  </div>
</header>

</>
  )
}

export default Navbar