import React, { useState } from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialSection = () => {
  const [expanded, setExpanded] = useState(() => dummyTestimonial.map(() => false));
  const toggle = (i) => setExpanded(prev => { const copy = [...prev]; copy[i] = !copy[i]; return copy; });

  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 bg-gray-50">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 leading-snug">
          Trusted by Thousands of Successful Learners
        </h2>
        <p className="text-gray-600 mt-4 text-lg">
          Join over <span className="font-semibold text-blue-600">50,000+</span> students who have transformed their careers through our courses.
          Here's what they have to say about their journey.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between"
          >
            {/* User Info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover border border-gray-200"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>

            {/* Testimonial Message */}
            <p className={`text-gray-600 text-base leading-relaxed mb-4 ${expanded[index] ? '' : 'line-clamp-4'}`}>
              “{testimonial.message}”
            </p>

            {/* Star Rating */}
            <div className="flex items-center mb-3">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                  alt="rating"
                  className="w-5 h-5"
                />
              ))}
            </div>

            {/* Feedback + CTA */}
            <p className={`text-gray-500 text-sm mb-3 ${expanded[index] ? '' : 'line-clamp-2'}`}>{testimonial.feedback}</p>
            <button
              onClick={(e) => { e.preventDefault(); toggle(index); }}
              className="text-blue-600 font-medium text-sm hover:text-blue-700 transition self-start"
              aria-expanded={expanded[index]}
            >
              {expanded[index] ? 'Read less ←' : 'Read more →'}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TestimonialSection
