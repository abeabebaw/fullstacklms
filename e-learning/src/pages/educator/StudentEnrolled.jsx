import React, { useEffect, useContext } from 'react'
import { useState } from 'react';
import Loading from '../../components/student/Loading';
import { dummyStudentEnrolled } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { useAuth } from '@clerk/clerk-react';
import { apiService } from '../../services/api';

const StudentEnrolled = () => {
  const { enrolledStudents, fetchEnrolledStudentsData } = useContext(AppContext);
  const { getToken } = useAuth();
  const [localEnrolledStudents, setLocalEnrolledStudents] = useState(null)
  const [loading, setLoading] = useState(true);
  
  const fetchEnrolledStudents = async () => {
    const token = await getToken();
    const result = await apiService.getEnrolledStudentsData(token);
    if (result.success) {
      setLocalEnrolledStudents(result.enrolledStudents);
    } else {
      console.error('Failed to fetch enrolled students:', result.error);
      // On error, do not render dummy immediately; leave empty to show fallback message
      setLocalEnrolledStudents([]);
    }
    setLoading(false);
  }
  
  useEffect(() => {
    fetchEnrolledStudents()
  }, [])
  
  const data = localEnrolledStudents ?? enrolledStudents;
  
  // Add a fallback image URL for cases where imageUrl is null
  const getImageUrl = (student) => {
    return student?.imageUrl || '/default-avatar.png'; // Add a default avatar path
  }
  
  // Add a fallback name for cases where student or name is null
  const getStudentName = (student) => {
    return student?.name || 'Unknown Student';
  }

  if (loading) return <Loading />

  return Array.isArray(data) && data.length > 0 ? (
    <div className="bg-slate-50 p-4 rounded-md">
      <table className='md:table-auto table-fixed w-full overflow-hidden bg-white border border-slate-200 rounded-md'>
        <thead className="text-slate-900 border-b border-slate-200 text-sm text-left">
          <tr>
            <th className="px-4 py-3 font-semibold truncate">#</th>
            <th className="px-4 py-3 font-semibold truncate">Student name</th>
            <th className="px-4 py-3 font-semibold truncate">CourseTitle</th>
            <th className="px-4 py-3 font-semibold truncate">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-slate-200">
              <td className="px-4 py-3 text-center hidden sm:table-cell text-slate-700">{index + 1}</td>
              <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                <img
                  src={getImageUrl(item.student)}
                  alt="Student"
                  className="w-9 h-9 rounded-full"
                
                />
                <span className="truncate text-slate-800">{getStudentName(item.student)}</span>
              </td>
              <td className="px-4 py-3 truncate text-slate-700">{item.courseTitle || 'No Course Title'}</td>
              <td className="px-4 py-3 hidden sm:table-cell text-slate-700">
                {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="p-4 text-slate-600">No enrolled students found.</div>
  )
}

export default StudentEnrolled