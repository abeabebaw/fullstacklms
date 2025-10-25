// src/context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const location = useLocation();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // ✅ Detect if current route belongs to educator area
  useEffect(() => {
    const educatorMode = location.pathname.startsWith("/educator");
    setIsEducator(educatorMode);
  }, [location.pathname]);

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setAllCourses(dummyCourses);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setAllCourses([]);
      setLoading(false);
    }
  };

  const calculateRating = (course) => {
    if (!course) return 0;
    const ratings = Array.isArray(course.courseRating)
      ? course.courseRating
      : Array.isArray(course.courseRatings)
      ? course.courseRatings
      : [];
    if (ratings.length === 0) return 0;

    let total = 0;
    ratings.forEach((r) => (total += r?.rating || 0));
    return (total / ratings.length).toFixed(1);
  };

  const safeNavigate = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = path;
    }
  };

  const calculateChapterTime = (chapter) => {
    if (!chapter || !Array.isArray(chapter.chapterContent)) return "0m";
    let time = 0;
    chapter.chapterContent.forEach(
      (lecture) => (time += lecture?.lectureDuration || 0)
    );
    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
      round: true,
    });
  };

  const calculateCourseDuration = (course) => {
    if (!course || !Array.isArray(course.courseContent)) return "0m";
    let time = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        chapter.chapterContent.forEach(
          (lecture) => (time += lecture?.lectureDuration || 0)
        );
      }
    });
    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
      round: true,
    });
  };

  const calculateNoOfLectures = (course) => {
    if (!course || !Array.isArray(course.courseContent)) return 0;
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  };

  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);

  const value = {
    currency,
    allCourses,
    setAllCourses,
    navigate: safeNavigate,
    isEducator,
    setIsEducator,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    loading,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
