import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Loading from '../../components/student/Loading'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'

const Player = () => {
  const params = useParams()
  const routeId = params.courseId ?? params.id
  const { enrolledCourses = [], allCourses = [], calculateChapterTime } = useContext(AppContext)
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const contentRefs = useRef({})
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!routeId) return

    // Try enrolled courses first
    let found = enrolledCourses.find((c) => String(c._id) === String(routeId))

    // Fallback to allCourses (matches CourseDetails behavior)
    if (!found && allCourses && allCourses.length > 0) {
      found = allCourses.find((c) => String(c._id) === String(routeId))
    }

    if (found) {
      setCourseData(found)
      setNotFound(false)
    } else {
      // If both sources are populated but we didn't find it, show not found.
      if ((enrolledCourses && enrolledCourses.length > 0) || (allCourses && allCourses.length > 0)) {
        setNotFound(true)
      }
    }
  }, [routeId, enrolledCourses, allCourses])

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const setPlayer = (lectureObj) => {
    setPlayerData(lectureObj)
  }

  const renderPlayer = (lecture) => {
    if (!lecture || !lecture.lectureUrl) return <div className="p-6 text-sm text-gray-500">Select a lecture to play</div>

    const url = lecture.lectureUrl
    const isYouTube = /youtube.com|youtu.be/.test(url)
    if (isYouTube) {
      // extract video id
      let videoId = ''
      try {
        const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
        videoId = m ? m[1] : url.split('/').pop()
      } catch (e) {
        videoId = url
      }
      const embed = `https://www.youtube.com/embed/${videoId}`
      return (
        <div className="aspect-w-16 aspect-h-9 bg-black">
          <iframe
            title={lecture.lectureTitle}
            src={embed}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )
    }

    return (
      <video controls className="w-full bg-black rounded">
        <source src={lecture.lectureUrl} />
        Your browser does not support the video tag.
      </video>
    )
  }

  if (!courseData) {
    if (notFound) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">Course not found</h2>
            <p className="text-sm text-gray-600 mt-2">The course you're trying to access was not found or you don't have access to it.</p>
          </div>
        </div>
      )
    }

    return <Loading />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-cyan-50 via-white to-white">
      <main className="flex-1 flex md:flex-row flex-col-reverse items-start justify-between md:px-28 px-6 pt-12 pb-16 gap-14">
        {/* LEFT: Course Structure */}
        <div className="max-w-2xl space-y-8 text-gray-800">
          <h1 className="text-2xl font-semibold text-gray-900">{courseData?.courseTitle ?? 'Course'}</h1>
          <div className="pt-2">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Course Content</h2>
            {courseData.courseContent?.map((chapter, index) => {
              const chapKey = chapter._id ?? `chapter-${index}`
              return (
                <div key={chapKey} className="rounded-lg border border-gray-200 bg-white shadow-sm mb-3 overflow-hidden transition-all duration-300 hover:shadow-md">
                  <button
                    onClick={() => toggleSection(chapKey)}
                    className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    aria-expanded={!!openSections[chapKey]}
                  >
                    <div className="flex items-center gap-3">
                      <img src={assets.down_arrow_icon} alt="arrow" className={`w-4 transition-transform duration-300 ${openSections[chapKey] ? 'rotate-180' : ''}`} />
                      <p className="font-medium text-gray-800">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-sm text-gray-500">{chapter.chapterContent?.length || 0} lectures • {calculateChapterTime ? calculateChapterTime(chapter) : 'N/A'}</p>
                  </button>

                  <div
                    ref={(el) => (contentRefs.current[chapKey] = el)}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: openSections[chapKey] ? `${contentRefs.current[chapKey]?.scrollHeight ?? 0}px` : '0px',
                      transition: prefersReducedMotion ? 'none' : 'max-height 0.3s ease',
                    }}
                  >
                    <ul className="list-disc pl-10 pr-5 py-3 bg-white text-gray-600 text-sm">
                      {chapter.chapterContent?.map((lecture, i) => (
                        <li key={i} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <img className="w-4 h-4" src={assets.play_icon} alt="play" />
                            <span>{lecture.lectureTitle}</span>
                          </div>
                          <div className="flex gap-3 text-xs text-gray-500">
                            {lecture.lectureUrl && (
                              <span
                                onClick={() => setPlayer({ videoId: lecture.lectureUrl.split('/').pop(), lectureTitle: lecture.lectureTitle })}
                                className="text-blue-600 font-medium cursor-pointer hover:underline"
                              >
                                Preview
                              </span>
                            )}
                            <span>{humanizeDuration((lecture.lectureDuration || 0) * 60 * 1000, { units: ['h', 'm'], round: true })}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Rating Section - Moved to main content area for better visibility */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Rating</h3>
            <Rating />
            <p className="text-sm text-gray-600 mt-3">Share your experience with this course</p>
          </div>
        </div>

        {/* RIGHT: Player & Info */}
        <aside className="bg-white rounded-xl shadow-lg overflow-hidden min-w-[320px] sm:min-w-[400px]">
          {playerData && playerData.videoId ? (
            <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName="w-full aspect-video" />
          ) : playerData && playerData.lectureUrl ? (
            <video controls className="w-full h-52 object-cover bg-black">
              <source src={playerData.lectureUrl} />
            </video>
          ) : (
            <img src={courseData.courseThumbnail} alt="Course Thumbnail" className="w-full h-52 object-cover" />
          )}

          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <img className="w-4 h-4" src={assets.time_left_clock_icon} alt="clock" />
              <p className="text-sm text-red-500 font-medium"><span className="font-semibold">5 days</span> left at this price!</p>
            </div>

            <div className="pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">What's Playing</h4>
              <p className="text-sm text-gray-700">{playerData?.lectureTitle ?? 'Select a lecture to play'}</p>
            </div>

            <div className="pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Course Info</h4>
              <ul className="list-disc pl-6 text-gray-600 text-sm space-y-1">
                <li>Chapters: {courseData.courseContent?.length ?? 0}</li>
                <li>Lectures: {courseData ? courseData.courseContent?.reduce((acc, ch) => acc + (ch.chapterContent?.length || 0), 0) : 0}</li>
                {/* Rating removed from here and moved to main content */}
              </ul>
            </div>
          </div>
        </aside>
      </main>
      <Footer/>
    </div>
  )
}

export default Player