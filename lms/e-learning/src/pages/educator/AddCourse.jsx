import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    level: 'beginner',
    thumbnail: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Course Data:', courseData);
    alert('Course created successfully!');
    // Reset form
    setCourseData({
      title: '',
      description: '',
      category: '',
      price: '',
      level: 'beginner',
      thumbnail: null
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Course</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter course title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={courseData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your course"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={courseData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="programming">Programming</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={courseData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <div className="flex gap-4">
                {['beginner', 'intermediate', 'advanced'].map(level => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="level"
                      value={level}
                      checked={courseData.level === level}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCourseData(prev => ({ ...prev, thumbnail: e.target.files[0] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition duration-300"
            >
              Create Course
            </button>
            <Link
              to="/educator"
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition duration-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;