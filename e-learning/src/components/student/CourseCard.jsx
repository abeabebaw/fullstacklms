import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { Star, Clock, Users } from 'lucide-react';

const CourseCard = ({ courses }) => {
  const { currency, calculateRating } = useContext(AppContext);

  const basePrice = courses?.coursePrice || 0;
  const discount = courses?.discount || 0;
  const finalPrice = (basePrice - (discount * basePrice / 100)).toFixed(2);

  const rating = calculateRating(courses);
  const starCount = Math.floor(rating);
  const ratingCount = Array.isArray(courses?.courseRatings)
    ? courses.courseRatings.length
    : Array.isArray(courses?.courseRating)
    ? courses.courseRating.length
    : 0;

  const scrollToTop = () => window.scrollTo(0, 0);

  return (
    <Link
      to={`/courses/${courses?._id || ''}`}
      onClick={scrollToTop}
      className="
        group block
        bg-white rounded-2xl overflow-hidden
        border border-gray-100 shadow-sm
        hover:shadow-2xl hover:shadow-indigo-100/40
        hover:border-indigo-200
        transition-all duration-300 hover:-translate-y-1
      "
    >
      {/* Image container */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={courses?.courseThumbnail || assets.placeholder}
          alt={courses?.courseTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => (e.target.src = assets.placeholder)}
        />

        {/* Overlay gradient + badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Discount badge */}
        {discount > 0 && (
          <div className="
            absolute top-3 right-3
            bg-gradient-to-r from-red-500 to-rose-600
            text-white text-xs font-bold px-3 py-1.5 rounded-full
            shadow-lg shadow-red-500/30
          ">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <h3 className="
          text-lg font-bold text-gray-900
          line-clamp-2 leading-tight
          group-hover:text-indigo-700 transition-colors
        ">
          {courses?.courseTitle || 'Untitled Course'}
        </h3>

        <p className="text-sm text-gray-500 font-medium">BIRUH AMIRO</p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < starCount ? "text-amber-400 fill-amber-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({ratingCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">
            {finalPrice} {currency}
          </span>

          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {basePrice} {currency}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;