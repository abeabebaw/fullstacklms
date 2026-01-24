import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import SearchBar from '../../components/student/SearchBar'
import FlipCard from '../../components/student/FlipCard'

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-cyan-100/80 to-white -z-20 animate-gradient-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.10),transparent_60%)] -z-10" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 via-cyan-300/10 to-transparent rounded-full blur-3xl -z-10" />

    
   

      {/* Headline */}
      <h1 className="text-xl sm:text-xl md:text-xl lg:text-7xl font-extrabold text-center max-w-4xl leading-tight md:leading-snug animate-fade-in-up animation-delay-500">
        <span className="block text-gray-900">Unlock Your Potential</span>
        <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent animate-gradient-text mt-2">
          Learn. Grow. Succeed.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 md:mt-8 text-lg md:text-2xl text-gray-700/90 max-w-2xl text-center font-light leading-relaxed animate-fade-in-up animation-delay-700">
        Join thousands of learners and educators on a journey to master tomorrow’s skills, today.
      </p>

      {/* Call to Action & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 md:mt-14 animate-fade-in-up animation-delay-900 w-full max-w-2xl">
        <div className="flex-1 w-full">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-70 animate-pulse-slow" />
            <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl shadow-blue-100/30 border border-white/40 p-1.5 transform hover:scale-[1.02] transition-transform duration-300">
              <SearchBar />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/course-list')}
          className="inline-block px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Explore Courses
        </button>
      </div>

      {/* Flip Card Section */}
      <div className="w-full flex flex-col items-center mt-20">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Why Choose Our Platform?</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <FlipCard
            frontIcon={<svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H6m6 0h6" /></svg>}
            frontTitle="Expert Instructors"
            backText="Learn from industry leaders and certified educators with real-world experience."
            color="border-blue-400"
          />
          <FlipCard
            frontIcon={<svg className="w-10 h-10 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V7a2 2 0 012-2h12a2 2 0 012 2v7c0 2.21-3.582 4-8 4z" /></svg>}
            frontTitle="Flexible Learning"
            backText="Access courses anytime, anywhere, and learn at your own pace with our flexible platform."
            color="border-cyan-400"
          />
          <FlipCard
            frontIcon={<svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            frontTitle="Certification"
            backText="Earn recognized certificates to showcase your achievements and boost your career."
            color="border-amber-400"
          />
        </div>
      </div>

      {/* Floating Orbs & Decorative Elements */}
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-float-slow" />
      <div className="absolute top-20 right-12 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl -z-10 animate-float-slow animation-delay-1000" />
      <div className="absolute top-1/2 left-0 w-16 h-16 bg-blue-300/10 rounded-full blur-2xl -z-10 animate-float-slow animation-delay-700" />
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-cyan-300/10 rounded-full blur-2xl -z-10 animate-float-slow animation-delay-500" />
    </section>
  )
}

export default Hero