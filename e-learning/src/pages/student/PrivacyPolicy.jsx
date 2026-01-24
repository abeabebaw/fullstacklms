import React from "react";


const PrivacyPolicy = () => (
  <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-white py-12 px-2">
    <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100 relative overflow-hidden animate-fade-in-up">
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
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z" /></svg>
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-2 text-center">Privacy Policy</h1>
        <p className="text-lg text-gray-700 max-w-xl text-center">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our e-learning platform.
        </p>
      </div>
      <div className="space-y-8 mt-6">
        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">1. Information We Collect</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Personal information (name, email and password) provided during registration or subscription.</li>
            <li>Usage data (pages visited, courses viewed, etc.).</li>
            <li>Communication data (messages, feedback, support requests).</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>To provide and improve our services.</li>
            <li>To notify you about new courses, updates, and offers (if subscribed).</li>
            <li>To respond to your inquiries and support requests.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">3. Data Protection</h2>
          <p>We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">4. Third-Party Services</h2>
          <p>We do not sell or share your personal information with third parties except as required by law or to provide our services (e.g., payment processing).</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">5. Your Choices</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>You may update your profile or unsubscribe from notifications at any time.</li>
            <li>Contact us for any privacy-related questions or requests.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">6. Updates to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated date.</p>
        </section>
      </div>
      <p className="mt-10 text-center text-gray-500">Last updated: January 22, 2026</p>
    </div>
  </div>
);

export default PrivacyPolicy;
