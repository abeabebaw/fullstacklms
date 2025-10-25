import React, { useEffect } from 'react'
import { useState } from 'react';
import Loading from '../../components/student/Loading';
import { dummyStudentEnrolled } from '../../assets/assets';
import { use } from 'react';
const StudentEnrolled = () => {
  const[enrolledStudents,setEnrolledStudents]=useState(null)
  const[courses,setCourses]=useState(null);
  const fetchEnrolledStudents=()=>{
 setEnrolledStudents(dummyStudentEnrolled)
  }
 useEffect(()=>{
  fetchEnrolledStudents()

 },[])
  return enrolledStudents? (
    <div>
        <table className=' md:table-auto table-fixed  w-full overflow-hidden'>
    <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
      <tr>
        <th className="px-4 py-3 font-semibold truncate">#</th>
        <th className="px-4 py-3 font-semibold truncate">Student name</th>
        <th className="px-4 py-3 font-semibold truncate">CourseTitle</th>
        <th className="px-4 py-3 font-semibold truncate">Date</th>

      </tr>
    </thead>
  <tbody>
    {enrolledStudents.map((item, index) => (
        <tr key={index} className="border-b border-gray-500/20">
            <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
            <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                <img
                    src={item.student.imageUrl}
                    alt=""
                    className="w-9 h-9 rounded-full"
                />
                <span className="truncate">{item.student.name}</span>
            </td>
            <td className="px-4 py-3 truncate">{item.courseTitle}</td>
            <td className="px-4 py-3 hidden sm:table-cell">{new Date(item.purchaseDate).toLocaleDateString()}</td>
        </tr>
    ))}
</tbody>
    </table>
    </div>
  ):<Loading/>
}

export default StudentEnrolled