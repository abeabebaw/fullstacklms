import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        
        {/* Left Section */}
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <img
            src={assets.logo}
            alt="BIRUHAMIRO Logo"
            className="w-10 md:w-12 object-contain"
          />
          <div className="hidden md:block h-7 w-px bg-gray-300 dark:bg-gray-700" />
          <p className="text-xs md:text-sm">
            © {new Date().getFullYear()} <span className="font-semibold text-gray-800 dark:text-gray-200">BIRUHAMIRO E-LEARNING</span>. All rights reserved.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5 text-gray-600 dark:text-gray-300">
          <Link
            to="/contact"
            className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Contact Us
          </Link>
          <a
            href="#"
            aria-label="Facebook"
            className="hover:text-blue-600 transition-transform transform hover:scale-110"
          >
            <i className="fab fa-facebook-f text-lg"></i>
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="hover:text-sky-500 transition-transform transform hover:scale-110"
          >
            <i className="fab fa-twitter text-lg"></i>
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="hover:text-blue-500 transition-transform transform hover:scale-110"
          >
            <i className="fab fa-linkedin-in text-lg"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
