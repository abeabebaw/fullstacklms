import React from "react";


const About = () => (
  <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-white py-12 px-2">
    <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 opacity-20 pointer-events-none select-none">
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="80" r="80" fill="url(#paint0_linear)" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563eb" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full p-4 shadow-lg mb-2">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H6m6 0h6" /></svg>
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-2">About Us</h1>
        <p className="text-lg text-gray-700 max-w-xl">
          Welcome to our <span className="font-semibold text-blue-600">E-Learning Platform</span>! We are dedicated to providing high-quality online education for students and educators worldwide. Our mission is to make learning accessible, engaging, and effective for everyone.
        </p>
      </div>
      <div className="flex flex-col gap-4 text-left text-gray-600 mt-6">
        <div className="flex items-start gap-3">
          <span className="inline-block mt-1 text-blue-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20.5C7.305 20.5 3.5 16.695 3.5 12S7.305 3.5 12 3.5 20.5 7.305 20.5 12 16.695 20.5 12 20.5z" /></svg>
          </span>
          <p><span className="font-semibold text-blue-600">Our Vision:</span> Empower learners and educators with innovative digital tools and resources.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="inline-block mt-1 text-cyan-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V9a4 4 0 00-3-3.87M9 4V3a4 4 0 013-3.87" /></svg>
          </span>
          <p><span className="font-semibold text-cyan-600">Our Values:</span> Accessibility, Quality, Collaboration, and Growth.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="inline-block mt-1 text-blue-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </span>
          <p>Thank you for being part of our journey!</p>
        </div>
      </div>
    </div>
  </div>
);

export default About;
