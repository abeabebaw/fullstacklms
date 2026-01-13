import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from '../../components/student/SearchBar'

function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-12 pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50/70 to-indigo-50/40 -z-10 animate-gradient-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)] -z-10" />

      {/* Marquee */}
      <div className="w-full max-w-5xl mb-8 md:mb-12 animate-fade-in-up animation-delay-300">
        <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl shadow-blue-100/20">
          <div className="py-3.5 px-6 text-sm md:text-base font-medium text-gray-700 tracking-wide flex items-center gap-4 whitespace-nowrap">
            <span className="font-bold text-blue-700">BIRUHAMIRO</span>
            <span className="text-gray-400">•</span>
            <span>Future-Proof Learning</span>
            <span className="text-gray-400">•</span>
            <span className="text-emerald-600 font-semibold">Expert Mentorship</span>
            <span className="text-gray-400">•</span>
            <span className="text-violet-600 font-semibold">Career Acceleration</span>
            <span className="text-gray-400">•</span>
            <span>Adaptive • Real-Time • Personalized</span>
            <span className="text-amber-500">✦</span>
          </div>
        </div>
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight text-center max-w-5xl leading-tight md:leading-snug animate-fade-in-up animation-delay-500">
        Master Tomorrow's Skills
        <br className="hidden sm:block" />
        <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent animate-gradient-text">
          Today
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 md:mt-8 text-lg md:text-xl text-gray-600/90 max-w-3xl text-center font-light leading-relaxed animate-fade-in-up animation-delay-700">
        Future-ready education • Expert guidance • Career-focused paths
      </p>

      {/* Search */}
      <div className="w-full max-w-2xl mt-10 md:mt-14 animate-fade-in-up animation-delay-900">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-70 animate-pulse-slow" />
          <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl shadow-blue-100/30 border border-white/40 p-1.5 transform hover:scale-[1.02] transition-transform duration-300">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Floating orbs */}
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-float-slow" />
      <div className="absolute top-20 right-12 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl -z-10 animate-float-slow animation-delay-1000" />
    </div>
  )
}

export default Hero