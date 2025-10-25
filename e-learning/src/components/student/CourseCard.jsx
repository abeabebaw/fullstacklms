import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const CourseCard = ({ courses }) => {
  const { currency, calculateRating } = useContext(AppContext);

  // Price calculation
  const basePrice = courses?.coursePrice || 0;
  const discount = courses?.discount || 0;
  const finalPrice = (basePrice - (discount * basePrice / 100)).toFixed(2);

  // Rating calculation
  const rating = calculateRating(courses);
  const starCount = Math.floor(rating);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Link
      to={`/courses/${courses?._id || ''}`}
      className="border rounded-lg p-4 hover:shadow-lg transition overflow-hidden border-blue-500/30 bg-white block"
      onClick={scrollToTop}
    >
      <div className="text-left space-y-3">
        {/* Thumbnail */}
        <img
          src={courses?.courseThumbnail || assets.placeholder}
          alt={courses?.courseTitle || 'Course'}
          className="w-full h-48 object-cover rounded-md"
          onError={(e) => (e.target.src = assets.placeholder)}
        />

        {/* Details */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold line-clamp-2">
            {courses?.courseTitle || 'Untitled Course'}
          </h3>
          <p className="text-gray-500 text-sm">BIRUH AMIRO</p>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600 font-semibold">{rating}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < starCount ? assets.star : assets.star_blank}
                  alt="star"
                  className="w-4 h-4"
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm">
              ({courses?.courseRating?.length || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            {discount > 0 && (
              <span className="text-gray-400 line-through text-sm">
                {basePrice} {currency}
              </span>
            )}
            <span className="text-lg font-semibold text-gray-800">
              {finalPrice} {currency}
            </span>
            {discount > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
