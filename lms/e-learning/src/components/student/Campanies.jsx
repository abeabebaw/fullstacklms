import React from 'react'
import { assets } from '../../assets/assets'

function Companies() {
  return (
    <section className="pt-16">
      {/* Heading */}
      <p className="text-center text-gray-600 font-medium mb-8 text-lg">
        Trusted by learners from
      </p>

      {/* Grid Logos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-12 place-items-center">
        <div className="flex items-center justify-center h-14 w-32">
          <img 
            src={assets.microsoft_logo} 
            alt="Microsoft" 
            className="max-h-full object-contain grayscale hover:grayscale-0 transition duration-300"
          />
        </div>
        <div className="flex items-center justify-center h-14 w-32">
          <img 
            src={assets.walmart_logo} 
            alt="Walmart" 
            className="max-h-full object-contain grayscale hover:grayscale-0 transition duration-300"
          />
        </div>
        <div className="flex items-center justify-center h-14 w-32">
          <img 
            src={assets.accenture_logo} 
            alt="Accenture" 
            className="max-h-full object-contain grayscale hover:grayscale-0 transition duration-300"
          />
        </div>
        
        {/* Adobe Logo with Telebirr Text */}
        <div className="flex flex-col items-center justify-center h-14 w-32 space-y-2">
          <img 
            src={assets.adobe_logo} 
            alt="Adobe" 
            className="max-h-8 object-contain grayscale hover:grayscale-0 transition duration-300"
          />
          <span className="text-black font-extrabold text-sm tracking-wide">
            Telebirr
          </span>
        </div>
        
        <div className="flex items-center justify-center h-14 w-32">
          <img 
            src={assets.paypal_logo} 
            alt="PayPal" 
            className="max-h-full object-contain grayscale hover:grayscale-0 transition duration-300"
          />
        </div>
      </div>
    </section>
  )
}

export default Companies