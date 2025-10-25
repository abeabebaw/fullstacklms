import { createContext, useState, useEffect } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';


export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      // Simulate API call
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

  // ✅ Calculate average rating safely
  const calculateRating = (course) => {
    if (!course || !course.courseRating || course.courseRating.length === 0) {
      return 0;
    }

    let total = 0;
    course.courseRating.forEach(r => {
      total += r.rating || 0;
    });

    return (total / course.courseRating.length).toFixed(1);
  };


  // ✅ Safe navigate wrapper
  const safeNavigate = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = path;
    }
  };
   const calculateChapterTime=(chapter)=>{
    let time=0
    chapter.chapterContent.map((lecture)=>time+=lecture.lectureDuration)
    return humanizeDuration(time *60*1000,{units:["h","m",""]})
   }

const calculateCourseDuration =(course)=>{
  let time=0;
  course.courseContent.map((chapter)=>chapter.chapterContent.map((lecture)=>time +=lecture.lectureDuration))
   return humanizeDuration(time *60*1000,{units:["h","m",""]})

}
 const calculateNoOfLectures=()=>{
  let totalLectures=0;
  course.courseContent.forEach(chapter=>{
    if(Array.isArray(chapter.chapterContent)){
      totalLectures+=chapter.chapterContent.length;
    }
  });
  return totalLectures;
 }
  useEffect(() => {
    fetchAllCourses();
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
    calculateCourseDuration  ,
    calculateNoOfLectures,

    loading,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
