import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from '@clerk/clerk-react';
import Loading from "../../components/student/Loading";
import Footer from "../../components/student/Footer";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import { apiService } from '../../services/api';
import { Link } from 'react-router-dom';

const CourseDetails = () => {
  const { id } = useParams();
  const { getToken, userId } = useAuth();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayer] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [progress, setProgress] = useState({ completedLectures: [], completed: false, progressPercent: 0 });

  const {
    allCourses,
    calculateRating,
    currency,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    navigate,
    purchaseCourse,
  fetchAllCourses,
  getRatingCount,
  getUserRating,
  } = useContext(AppContext);

  // Load selected course
  useEffect(() => {
    const fetchCourseData = async () => {
      if (id) {
        try {
          let token = null;
          try { token = await getToken(); } catch (e) { token = null; }
          const result = await apiService.getCourseById(id, token);
          if (result.success) {
            setCourseData(result.courseData);
            // determine if current user is enrolled (or is the educator)
            try {
              const currentUserId = userId || null;
              const enrolled = !!(currentUserId && result.courseData.enrolledStudents && result.courseData.enrolledStudents.map(String).includes(String(currentUserId)));
              const isEducator = !!(currentUserId && result.courseData.educator && (String(result.courseData.educator._id || result.courseData.educator) === String(currentUserId)));
              setIsAlreadyEnrolled(enrolled || isEducator);
            } catch (e) {
              // ignore
            }
            // fetch user progress for this course (if signed in)
            try {
              if (token) {
                const p = await apiService.getCourseProgress(id, token);
                if (p.success) setProgress(p.progress);
              }
            } catch (e) {}
          } else {
            console.error('Failed to fetch course:', result.message);
            setCourseData(null);
          }
        } catch (error) {
          console.error('Error fetching course:', error);
          setCourseData(null);
        }
      }
    };
    
    fetchCourseData();
    window.scrollTo(0, 0);
  }, [id]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const contentRefs = useRef({});
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Handle Purchase with Chapa
  const handlePurchase = async () => {
    if (!userId) {
      const proceed = window.confirm('You need to sign in to enroll. Go to the homepage?');
      if (proceed) {
        navigate('/home');
      }
      return;
    }

    setPurchasing(true);
    try {
      const result = await purchaseCourse(id, finalPrice);
      
      if (result.success) {
        // Redirect to Chapa checkout
        window.location.href = result.checkoutUrl;
      } else {
        alert(result.message || 'Failed to initialize payment');
        setPurchasing(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to initialize payment. Please try again.');
      setPurchasing(false);
    }
  };

  // Extract YouTube video id from various URL formats
  const extractYouTubeId = (url) => {
    if (!url) return null;
    try {
      // Common patterns: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
      const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)(?:[&?/]|$)/i);
      if (ytMatch && ytMatch[1]) return ytMatch[1];

      // Try URL search param v=
      try {
        const parsed = new URL(url);
        const v = parsed.searchParams.get('v');
        if (v) return v;
      } catch (e) {
        // not a full URL, fallthrough to return null
      }

      // If we cannot confidently identify a YouTube id, return null
      return null;
    } catch (err) {
      return null;
    }
  };

  if (!courseData) return <Loading />;

  const rating = parseFloat(calculateRating(courseData));
  const starCount = Math.floor(rating);
  const basePrice = courseData?.coursePrice || 0;
  const discount = courseData?.discount || 0;
  const finalPrice = (basePrice - (discount * basePrice) / 100).toFixed(2);
  const totalRatings = getRatingCount(courseData);
  const totalStudents = courseData.enrolledStudents?.length || 0;

  return (
    <div className="flex flex-col min-h-screen bg-cyan">
      {/* MAIN CONTENT */}
      <main className="flex-1 flex md:flex-row flex-col-reverse items-start justify-between md:px-28 px-6 pt-12 pb-16 gap-14">
        {/* LEFT COLUMN */}
        <div className="max-w-2xl space-y-8 text-gray-800">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            {courseData.courseTitle || "Untitled Course"}
          </h1>

          <div
            className="text-gray-600 leading-relaxed rich-text"
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
              {/* Rating input for enrolled users */}
              {isAlreadyEnrolled && (
                <div className="ml-3 flex items-center gap-2">
                  <label className="text-sm text-gray-600">Your rating:</label>
                  {[1,2,3,4,5].map((val) => (
                    <button
                      key={val}
                      onClick={async () => {
                        try {
                          const token = await getToken();
                          const res = await apiService.rateCourse(courseData._id, val, token);
                          if (res.success) {
                            // refresh course data and course list
                            const updated = await apiService.getCourseById(courseData._id, token);
                            if (updated.success) setCourseData(updated.courseData);
                            try { await fetchAllCourses(); } catch (e) {}
                          } else {
                            alert(res.message || 'Failed to save rating');
                          }
                        } catch (err) {
                          console.error('Rating error', err);
                        }
                      }}
                      className="text-sm px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span>•</span>
            <p className="text-blue-600 font-medium">
              {totalStudents} {totalStudents === 1 ? "student" : "students"}
            </p>
            <span>•</span>
            <p className="text-blue-600 font-medium">
              Progress: {progress.progressPercent || 0}%
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
                            {(lecture.lectureUrl && (lecture.isPreviewFree || isAlreadyEnrolled)) && (
                              <span
                                onClick={() => {
                                  const url = lecture.lectureUrl;
                                  if (!url) {
                                    alert('Preview not available');
                                    return;
                                  }
                                  const id = extractYouTubeId(url);
                                  if (id) {
                                    setPlayer({ videoId: id });
                                  } else {
                                    setPlayer({ src: url });
                                  }
                                }}
                                className="text-blue-600 font-medium cursor-pointer hover:underline"
                              >
                                {isAlreadyEnrolled ? 'Play' : 'Preview'}
                              </span>
                            )}
                            {/* mark complete button for enrolled users */}
                            {isAlreadyEnrolled && (
                              <button
                                onClick={async () => {
                                  try {
                                    const token = await getToken();
                                    const res = await apiService.completeLecture(courseData._id, lecture.lectureId, token);
                                    if (res.success) {
                                      setProgress(res.progress);
                                    } else {
                                      alert(res.message || 'Failed to mark lecture completed');
                                    }
                                  } catch (err) {
                                    console.error('Complete lecture error', err);
                                  }
                                }}
                                className={`text-xs px-2 py-1 rounded ${progress.completedLectures?.includes(lecture.lectureId) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} hover:opacity-90`}
                              >
                                {progress.completedLectures?.includes(lecture.lectureId) ? 'Completed' : 'Mark complete'}
                              </button>
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
            playerData.videoId ? (
              <YouTube
                videoId={playerData.videoId}
                opts={{ playerVars: { autoplay: 1 } }}
                iframeClassName="w-full aspect-video"
              />
            ) : playerData.src ? (
              <video
                src={playerData.src}
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                className="w-full aspect-video object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <img
                src={courseData.courseThumbnail}
                alt="Course Thumbnail"
                className="w-full h-52 object-cover"
              />
            )
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
              onClick={handlePurchase}
              disabled={purchasing || isAlreadyEnrolled}
              className={`mt-6 w-full py-3 rounded-lg font-medium transition-all ${
                isAlreadyEnrolled
                  ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                  : purchasing
                  ? "bg-blue-400 text-white cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {purchasing ? 'Processing...' : isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </button>

            <div className="pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                What's Included
              </h4>
              <ul className="list-disc pl-6 text-gray-600 text-sm space-y-1">
                <li>Lifetime access with free updates</li>
                <li>Hands-on project guidance</li>
                <li>Downloadable resources & source code</li>
                <li>Quizzes to test your knowledge</li>
                <li>Certificate of completion</li>
              </ul>
              <div className="mt-4 space-y-2">
  <Link
  to={`/courses/${id}/quizzes`}
  className="
    inline-flex items-center justify-center w-full
    px-5 py-3
    rounded-xl
    font-bold
    text-blue-700
    bg-white
    border border-blue-300
    hover:bg-blue-50
    transition
    shadow-md
  "
>
  View Quizzes →
</Link>


                {isAlreadyEnrolled && (progress?.progressPercent > 0 || (progress?.completedLectures && progress.completedLectures.length > 0)) && (
                  <button
                    onClick={async () => {
                      if (!confirm('Reset your progress for this course? This will remove all completed lectures.')) return;
                      try {
                        const token = await getToken();
                        const res = await apiService.resetProgress(id, token);
                        if (res.success) {
                          setProgress(res.progress || { completedLectures: [], completed: false, progressPercent: 0 });
                          alert('Progress has been reset.');
                        } else {
                          alert(res.message || res.error || 'Failed to reset progress');
                        }
                      } catch (err) {
                        console.error('Reset progress', err);
                        alert('Failed to reset progress');
                      }
                    }}
                    className="w-full mt-2 inline-block text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Reset Progress
                  </button>
                )}
                {/* Download Certificate button: show when enrolled and course completed */}
                {isAlreadyEnrolled && progress?.completed && (
                  <button
                    onClick={async () => {
                      try {
                        const token = await getToken();
                        // find user's quiz results for this course
                        const myResults = await apiService.getMyQuizResults(token);
                        if (!myResults || !myResults.success) {
                          alert('Unable to fetch quiz results');
                          return;
                        }
                        const results = myResults.results || [];
                        // find most recent passing result for this course
                        const pass = results.find(r => String(r.courseId) === String(id) && r.passed);
                        if (!pass) {
                          alert('No passing quiz result found. You need to pass a course quiz with at least 50% to receive a certificate.');
                          return;
                        }
                        // request certificate generation and PDF
                        const gen = await apiService.submitQuizResult(id, pass.scorePercent, token);
                        if (gen && gen.success && gen.certificate && gen.certificate.certificateId) {
                          const pdfRes = await apiService.getCertificatePdf(gen.certificate.certificateId, token);
                          if (pdfRes && pdfRes.success && pdfRes.blob) {
                            const url = URL.createObjectURL(pdfRes.blob);
                            window.open(url, '_blank');
                            setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
                          } else {
                            alert('Failed to download certificate PDF');
                          }
                        } else {
                          alert(gen.message || 'Failed to generate certificate');
                        }
                      } catch (e) {
                        console.error('Certificate error', e);
                        alert('Failed to generate or open certificate');
                      }
                    }}
                    className="w-full mt-2 inline-block text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Download Certificate
                  </button>
                )}
              </div>
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
