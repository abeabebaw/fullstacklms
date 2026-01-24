import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-gray-300 px-4 sm:px-6 md:px-12 lg:px-20 py-10 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 border-b border-gray-700 pb-8 md:pb-10">
          
          {/* Brand Section */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <img
                src={assets.logo}
                alt="BIRUHAMIRO Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                BIRUHAMIRO<br className="sm:hidden" /> E-LEARNING
              </h1>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Empowering students with accessible, high-quality online education.
            </p>
            <div className="flex gap-5 mt-2">
              <a 
                href="#" 
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300"
              >
                <i className="fab fa-facebook text-lg"></i>
              </a>
              <a 
                href="#" 
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-sky-500 hover:scale-110 transition-all duration-300"
              >
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a 
                href="#" 
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-400 hover:scale-110 transition-all duration-300"
              >
                <i className="fab fa-linkedin text-lg"></i>
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white mb-1">Quick Links</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <Link 
                to="/home" 
                className="hover:text-white transition-colors text-sm hover:translate-x-2 duration-300 flex items-center gap-2 group"
              >
                <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Home
              </Link>
              <Link 
                to="/contact" 
                className="hover:text-white transition-colors text-sm hover:translate-x-2 duration-300 flex items-center gap-2 group"
              >
                <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Contact Us
              </Link>
              <a 
                href="#" 
                className="hover:text-white transition-colors text-sm hover:translate-x-2 duration-300 flex items-center gap-2 group"
              >
                <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                About Us
              </a>
              <Link 
                to="/privacy-policy" 
                className="hover:text-white transition-colors text-sm hover:translate-x-2 duration-300 flex items-center gap-2 group"
              >
                <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Privacy Policy
              </Link>
              <a 
                href="/course-list" 
                className="hover:text-white transition-colors text-sm hover:translate-x-2 duration-300 flex items-center gap-2 group"
              >
                <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Courses
              </a>
             
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} BIRUHAMIRO E-LEARNING. All rights reserved.
          </div>
        
        </div>
        
        {/* Mobile App Badges - Optional */}
        <div className="mt-8 flex justify-center gap-4">
         
         
        </div>
      </div>
    </footer>
  );
}

export default Footer;