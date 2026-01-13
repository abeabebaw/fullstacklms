import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { useState } from 'react'
import Loading from '../../components/student/Loading';
import { useAuth } from '@clerk/clerk-react';
import { apiService } from '../../services/api';
import { Link } from 'react-router-dom';

const Mycourses = () => {
  const{ currency, educatorCourses, fetchEducatorCourses }=useContext(AppContext)
  const { getToken } = useAuth();
  const[courses,setCourses]=useState(null);
   const fetchCourses=async()=>{
    const token = await getToken();
    const result = await apiService.getEducatorCourses(token);
    if (result.success) {
      setCourses(result.courses);
    } else {
      console.error('Failed to fetch educator courses:', result.error);
      setCourses([]);
    }
   }
useEffect(()=>{
  fetchCourses()

},[])
  return courses? (
    <div className='h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0 bg-slate-50'>
  <div className=' w-full'>
 <h2 className='pb-4 text-lg font-medium text-slate-900'>My Courses</h2>
<div className='flex flex-cols items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-slate-200'>
  <table className=' md:table-auto table-fixed  w-full overflow-hidden'>
    <thead className="text-slate-900 border-b border-slate-200 text-sm text-left">
      <tr>
        <th className="px-4 py-3 font-semibold truncate">All Courses</th>
        <th className="px-4 py-3 font-semibold truncate">Earnings</th>
        <th className="px-4 py-3 font-semibold truncate">Students</th>
        <th className="px-4 py-3 font-semibold truncate">Published On</th>
        <th className="px-4 py-3 font-semibold truncate">Actions</th>
      </tr>
    </thead>
    <tbody className="text-sm text-slate-600">
  {courses.map((course) => (
    <tr key={course._id} className="border-b border-slate-200">
      <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
        <img src={course.courseThumbnail} alt="Course Image" className="w-16" />
        <span className="truncate hidden md:block text-slate-800">{course.courseTitle}</span>
      </td>
      <td className="px-4 py-3">
       
        {Math.floor(
          course.enrolledStudents.length *
            (course.coursePrice - course.discount * course.coursePrice / 100)
        )}  {currency}
      </td>
      <td className="px-4 py-3 text-slate-800">{course.enrolledStudents.length}</td>
      <td className="px-4 py-3">
        {new Date(course.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <Link to={`/educator/edit-course/${course._id}`} className="text-sky-600 hover:text-sky-700">Edit</Link>
      </td>
    </tr>
  ))}
</tbody>

  </table>
</div>

  </div>
    </div>
  ):<Loading/>
}

export default Mycourses