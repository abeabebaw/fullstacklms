import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../components/student/Loading';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections,setOpenSections]=useState({})
  const {
    allCourses,
    calculateRating,
    currency,
    calculateChapterTime,
  } = useContext(AppContext);

  useEffect(() => {
    if (allCourses && id) {
      const found = allCourses.find((c) => c._id === id);
      setCourseData(found || null);
    }
    window.scrollTo(0, 0);
  }, [id, allCourses]);

const toggleSection=(index)=>{
  setOpenSections((prev)=>({...prev,[index]:!prev}))

}
  if (!courseData) return <Loading />;

  const rating = parseFloat(calculateRating(courseData));
  const starCount = Math.floor(rating);

  const basePrice = courseData?.coursePrice || 0;
  const discount = courseData?.discount || 0;
  const finalPrice = (basePrice - (discount * basePrice / 100)).toFixed(2);

  const totalRatings = courseData.courseRating?.length || 0;
  const ratingLabel = totalRatings > 1 ? 'ratings' : 'rating';
  const totalStudents = courseData.enrolledStudents?.length || 0;
  const studentLabel = totalStudents > 1 ? 'students' : 'student';

  return (
    <div className="flex md:flex-row flex-col-reverse items-start justify-between md:px-36 px-8 pt-10 text-left relative">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-100/70 -z-10"></div>

      {/* Left Column */}
      <div className="max-w-xl z-10 text-gray-700 space-y-6">
        <h1 className="md:text-4xl text-2xl font-semibold text-gray-900">
          {courseData.courseTitle || 'Untitled Course'}
        </h1>

        {/* Short Description */}
        <p
          className="pt-2 md:text-base text-sm"
          dangerouslySetInnerHTML={{
            __html: (courseData.courseDescription || '').slice(0, 400),
          }}
        />

        {/* Instructor and Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
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
              ({totalRatings} {ratingLabel})
            </span>
          </div>
          <span>•</span>
          <p className="text-blue-600 font-medium">
            {totalStudents} {studentLabel}
          </p>
          <span>•</span>
          <p className="font-medium">
            By{' '}
            <span className="underline text-blue-600">BIRUH AMIRO</span>
          </p>
        </div>

        {/* Course Structure */}
        <div className="pt-6 text-gray-800">
          <h2 className="text-xl font-semibold mb-3">Course Structure</h2>
          {courseData.courseContent?.map((chapter, index) => (
            <div
              key={index}
              className="border border-gray-300 bg-white mb-3 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                <div className="flex items-center gap-2">
                  <img
                    src={assets.down_arrow_icon}
                    alt="arrow icon"
                    className="w-4 h-4"
                  />
                  <p className="font-medium md:text-base text-sm">
                    {chapter.chapterTitle}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {chapter.chapterContent?.length || 0} lectures •{' '}
                  {calculateChapterTime
                    ? calculateChapterTime(chapter)
                    : 'N/A'}
                </p>
              </div>

              {/* Lecture List */}
              <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                {chapter.chapterContent?.map((lecture, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 py-1 "
                  >
                    <img
                      className="w-4 h-4 mt-1"
                      src={assets.play_icon}
                      alt="play icon"
                    />
                    <div className='flex items-center justify-between w-full text-gray-gray-800 text-xs md:text-default'>
                      <p className="font-medium">{lecture.lectureTitle}</p>
                      <div className="flex  gap-2">
                        {lecture.isPreviewFree && (
                          <span className="text-blue-600 cursor-pointer">
                            Preview
                          </span>
                        )}
                        <span>
                          {humanizeDuration(
                            (lecture.lectureDuration || 0) * 60 * 1000,
                            { units: ['h', 'm'], round: true }
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 pt-4">
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

      {/* Right Column */}
      <div className="z-10 mb-6 md:mb-0">
        <img
          src={courseData.courseThumbnail || assets.placeholder}
          alt={courseData.courseTitle || 'Course Thumbnail'}
          className="w-full md:w-96 h-56 object-cover rounded-lg shadow-md"
          onError={(e) => {
            e.target.src = assets.placeholder;
          }}
        />
      </div>
    </div>
  );
};

export default CourseDetails;
