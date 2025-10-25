import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/student/Loading";
import Footer from "../../components/student/Footer";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayer] = useState(null);

  const {
    allCourses,
    calculateRating,
    currency,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
  } = useContext(AppContext);

  // Load selected course
  useEffect(() => {
    if (allCourses && id) {
      const found = allCourses.find((c) => c._id === id);
      setCourseData(found || null);
    }
    window.scrollTo(0, 0);
  }, [id, allCourses]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const contentRefs = useRef({});
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!courseData) return <Loading />;

  const rating = parseFloat(calculateRating(courseData));
  const starCount = Math.floor(rating);
  const basePrice = courseData?.coursePrice || 0;
  const discount = courseData?.discount || 0;
  const finalPrice = (basePrice - (discount * basePrice) / 100).toFixed(2);
  const totalRatings = courseData.courseRating?.length || 0;
  const totalStudents = courseData.enrolledStudents?.length || 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-cyan-50 via-white to-white">
      {/* MAIN CONTENT */}
      <main className="flex-1 flex md:flex-row flex-col-reverse items-start justify-between md:px-28 px-6 pt-12 pb-16 gap-14">
        {/* LEFT COLUMN */}
        <div className="max-w-2xl space-y-8 text-gray-800">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            {courseData.courseTitle || "Untitled Course"}
          </h1>

          <p
            className="text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: (courseData.courseDescription || "").slice(0, 400),
            }}
          />

          {/* Metadata */}
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
              <span className="text-gray-500">
                ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
              </span>
            </div>
            <span>•</span>
            <p className="text-blue-600 font-medium">
              {totalStudents} {totalStudents === 1 ? "student" : "students"}
            </p>
            <span>•</span>
            <p className="font-medium">
              By <span className="underline text-blue-600">BIRUH AMIRO</span>
            </p>
          </div>

          {/* Course Structure */}
          <div className="pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Course Content
            </h2>
            {courseData.courseContent?.map((chapter, index) => {
              const chapKey = chapter._id ?? `chapter-${index}`;
              return (
                <div
                  key={chapKey}
                  className="rounded-lg border border-gray-200 bg-white shadow-sm mb-3 overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleSection(chapKey)}
                    className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    aria-expanded={!!openSections[chapKey]}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow"
                        className={`w-4 transition-transform duration-300 ${
                          openSections[chapKey] ? "rotate-180" : ""
                        }`}
                      />
                      <p className="font-medium text-gray-800">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {chapter.chapterContent?.length || 0} lectures •{" "}
                      {calculateChapterTime
                        ? calculateChapterTime(chapter)
                        : "N/A"}
                    </p>
                  </button>

                  <div
                    ref={(el) => (contentRefs.current[chapKey] = el)}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: openSections[chapKey]
                        ? `${contentRefs.current[chapKey]?.scrollHeight ?? 0}px`
                        : "0px",
                      transition: prefersReducedMotion
                        ? "none"
                        : "max-height 0.3s ease",
                    }}
                  >
                    <ul className="list-disc pl-10 pr-5 py-3 bg-white text-gray-600 text-sm">
                      {chapter.chapterContent?.map((lecture, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between py-1"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              className="w-4 h-4"
                              src={assets.play_icon}
                              alt="play"
                            />
                            <span>{lecture.lectureTitle}</span>
                          </div>
                          <div className="flex gap-3 text-xs text-gray-500">
                            {lecture.isPreviewFree && lecture.lectureUrl && (
                              <span
                                onClick={() =>
                                  setPlayer({
                                    videoId: lecture.lectureUrl.split("/").pop(),
                                  })
                                }
                                className="text-blue-600 font-medium cursor-pointer hover:underline"
                              >
                                Preview
                              </span>
                            )}
                            <span>
                              {humanizeDuration(
                                (lecture.lectureDuration || 0) * 60 * 1000,
                                { units: ["h", "m"], round: true }
                              )}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Description */}
          <div className="pt-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Course Description
            </h3>
            <p
              className="leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <aside className="bg-white rounded-xl shadow-lg overflow-hidden min-w-[320px] sm:min-w-[400px]">
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{ playerVars: { autoplay: 1 } }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img
              src={courseData.courseThumbnail}
              alt="Course Thumbnail"
              className="w-full h-52 object-cover"
            />
          )}

          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <img
                className="w-4 h-4"
                src={assets.time_left_clock_icon}
                alt="clock"
              />
              <p className="text-sm text-red-500 font-medium">
                <span className="font-semibold">5 days</span> left at this price!
              </p>
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-3 mb-4">
              {discount > 0 && (
                <span className="text-gray-400 line-through text-sm">
                  {basePrice} {currency}
                </span>
              )}
              <span className="text-2xl font-semibold text-gray-800">
                {finalPrice} {currency}
              </span>
              {discount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Course Stats */}
            <div className="flex items-center text-sm text-gray-600 gap-4 pb-4 border-b">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="rating" className="w-4 h-4" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <span className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-1">
                <img
                  src={assets.time_clock_icon}
                  alt="time"
                  className="w-4 h-4"
                />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <span className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-1">
                <img
                  src={assets.lesson_icon}
                  alt="lesson"
                  className="w-4 h-4"
                />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>

            <button
              onClick={() => setIsAlreadyEnrolled((s) => !s)}
              className={`mt-6 w-full py-3 rounded-lg font-medium transition-all ${
                isAlreadyEnrolled
                  ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>

            <div className="pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                What’s Included
              </h4>
              <ul className="list-disc pl-6 text-gray-600 text-sm space-y-1">
                <li>Lifetime access with free updates</li>
                <li>Hands-on project guidance</li>
                <li>Downloadable resources & source code</li>
                <li>Quizzes to test your knowledge</li>
                <li>Certificate of completion</li>
              </ul>
            </div>
          </div>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-gray-200 bg-gray-50">
        <Footer />
      </footer>
    </div>
  );
};

export default CourseDetails;
