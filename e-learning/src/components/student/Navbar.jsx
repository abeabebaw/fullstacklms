import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext';
import BecomeEducatorModal from '../../components/common/BecomeEducatorModal';

const Navbar = () => {
  const { navigate, isEducator, userProfile } = useContext(AppContext);
  const { openSignIn, openSignUp } = useClerk();
  const { user } = useUser();
  const location = useLocation();

  const isCourseListPage = location.pathname.includes('/course-list');
  const [becomeOpen, setBecomeOpen] = useState(false);

  const NavigationItems = () => {
    const role = userProfile?.role;

    if (role === 'admin') return null;

    if (isEducator || role === 'educator') {
      return (
        <button
          onClick={() => navigate('/educator')}
          className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
        >
          Educator Dashboard
        </button>
      );
    }

    return (
      <Link
        to="/my-enrollments"
        className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
      >
        My Enrollments
      </Link>
    );
  };

  return (
    <>
      <nav 
        className={`
          sticky top-0 z-50 
          border-b border-gray-200/80 backdrop-blur-sm
          ${isCourseListPage 
            ? 'bg-white/95 shadow-sm' 
            : 'bg-gradient-to-r from-cyan-50/80 to-blue-50/60'}
        `}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                src={assets.logo}
                alt="Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full cursor-pointer ring-1 ring-gray-200/60 hover:ring-blue-400 transition-all duration-200"
                onClick={() => navigate('/')}
              />
            </div>

            {/* Desktop Nav + Auth */}
            <div className="hidden md:flex items-center gap-6">
              {user && <NavigationItems />}

              {userProfile?.role === 'student' && (
                <button
                  onClick={() => setBecomeOpen(true)}
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Become Educator
                </button>
              )}

              {userProfile?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Admin
                </button>
              )}

              {user ? (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                      userButtonPopoverCard: { pointerEvents: "initial" }
                    }
                  }}
                />
              ) : (
                <div className="flex items-center gap-3">
                 
                  <button
                    onClick={() => openSignUp()}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Nav */}
            <div className="md:hidden flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  {!(userProfile?.role === 'admin' || userProfile?.role === 'educator') && (
                    <Link
                      to="/my-enrollments"
                      className="px-3 py-1.5 text-xs sm:text-sm font-medium bg-white/70 rounded-lg shadow-sm hover:bg-white/90 transition-colors"
                    >
                      Courses
                    </Link>
                  )}

                  {userProfile?.role === 'student' && (
                    <button
                      onClick={() => setBecomeOpen(true)}
                      className="px-3 py-1.5 text-xs sm:text-sm font-medium bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Educator
                    </button>
                  )}

                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: { avatarBox: "h-8 w-8" }
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => openSignIn()}
                  className="p-2 hover:bg-white/40 rounded-full transition-colors"
                >
                  <img src={assets.user_icon} alt="Login" className="w-7 h-7" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <BecomeEducatorModal 
        open={becomeOpen} 
        onClose={() => setBecomeOpen(false)} 
        onSubmitted={() => {}} 
      />
    </>
  );
};

export default Navbar;