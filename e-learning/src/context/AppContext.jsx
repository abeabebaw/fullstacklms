import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from '@clerk/clerk-react';
import { apiService } from '../services/api';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY || "birr";
  const navigate = useNavigate();
  const location = useLocation();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Detect if current route belongs to educator area
  useEffect(() => {
    const educatorMode = location.pathname.startsWith("/educator");
    setIsEducator(educatorMode);
  }, [location.pathname]);

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const result = await apiService.getAllCourses();
      if (result.success) {
        setAllCourses(result.courses);
      } else {
        console.error("Error fetching courses:", result.message);
        setAllCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setAllCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateRating = (course) => {
    if (!course) return 0;
    // canonical field name is `courseRatings`; support legacy `courseRating` if present
    const ratings = Array.isArray(course.courseRatings)
      ? course.courseRatings
      : Array.isArray(course.courseRating)
      ? course.courseRating
      : [];
    if (ratings.length === 0) return 0;
    let total = 0;
    ratings.forEach((r) => (total += r?.rating || 0));
    // return a Number with one decimal place
    return Number((total / ratings.length).toFixed(1));
  };

  const getRatingCount = (course) => {
    if (!course) return 0;
    const ratings = Array.isArray(course.courseRatings)
      ? course.courseRatings
      : Array.isArray(course.courseRating)
      ? course.courseRating
      : [];
    return ratings.length;
  };

  const getUserRating = (course, userId) => {
    if (!course || !userId) return null;
    const ratings = Array.isArray(course.courseRatings)
      ? course.courseRatings
      : Array.isArray(course.courseRating)
      ? course.courseRating
      : [];
    const found = ratings.find(r => String(r.userId) === String(userId));
    return found ? Number(found.rating) : null;
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
    try {
      const token = await getToken();
      const result = await apiService.getUserEnrolledCourses(token);
      if (result.success) {
        setEnrolledCourses(result.enrolledCourses);
      } else {
        console.error("Error fetching enrolled courses:", result.message);
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      setEnrolledCourses([]);
    }
  };

  const purchaseCourse = async (courseId) => {
    try {
      const token = await getToken();
      const result = await apiService.purchaseCourse(courseId, token);
      return result;
    } catch (error) {
      console.error("Purchase course error:", error);
      return { success: false, message: "Failed to purchase course" };
    }
  };

  const verifyPayment = async (tx_ref) => {
    try {
      const token = await getToken();
      const result = await apiService.verifyPayment(tx_ref, token);
      return result;
    } catch (error) {
      console.error("Verify payment error:", error);
      return { success: false, message: "Failed to verify payment" };
    }
  };

  useEffect(() => {
    fetchAllCourses();
    const syncUser = async () => {
      if (user) {
        try {
          const token = await getToken();
          const result = await apiService.getUserData(token);
          if (result.success && result.user) {
            setUserProfile(result.user);
            // Consider user as educator if local role or clerk public metadata says so
            setIsEducator((prev) => prev || result.user.role === 'educator');
          }
        } catch (err) {
          console.error('Error syncing user profile:', err);
        }
        fetchUserEnrolledCourses();
      }
    };
    syncUser();
  }, [user]);

  const value = {
    currency,
    allCourses,
    setAllCourses,
    fetchAllCourses,
    navigate: safeNavigate,
    isEducator,
    setIsEducator,
    calculateRating,
  getRatingCount,
  getUserRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    setEnrolledCourses,
    fetchUserEnrolledCourses,
    loading,
    purchaseCourse,
    verifyPayment,
    apiService,
    userProfile,
    setUserProfile
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};