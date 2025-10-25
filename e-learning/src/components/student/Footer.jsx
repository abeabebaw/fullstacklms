import React from "react";
import { assets } from "../../assets/assets";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 md:px-12 lg:px-20 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-700 pb-10">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src={assets.logo}
              alt="BIRUHAMIRO Logo"
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-xl font-semibold text-white">
              BIRUHAMIRO E-LEARNING
            </h1>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Empowering students with accessible, high-quality online education.
          </p>
          <div className="flex gap-4 mt-3">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook text-xl hover:text-blue-500 transition-colors"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter text-xl hover:text-sky-400 transition-colors"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin text-xl hover:text-blue-400 transition-colors"></i>
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white mb-2">Company</h2>
          {["Home", "Contact Us", "About Us", "Privacy Policy"].map((item, i) => (
            <a
              key={i}
              href="#"
              className="hover:text-white transition-colors text-sm"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white">
            Subscribe to our newsletter
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Get the latest updates, articles, and learning resources weekly.
          </p>
          <form
            className="flex items-center bg-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-blue-600 px-5 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-gray-500 text-sm mt-6">
        © {new Date().getFullYear()} BIRUHAMIRO E-LEARNING. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
