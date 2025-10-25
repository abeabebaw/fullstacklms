import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const Player = () => {
  const { id } = useParams();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(3600); // 1 hour in seconds

  // Sample video data - in real app, you'd fetch this based on course ID
  const course = {
    id: parseInt(id),
    title: `Course ${id}: Video Content`,
    currentVideo: 'Introduction to React',
    videos: [
      'Introduction to React',
      'Setting up Development Environment',
      'Your First React Component',
      'JSX Syntax',
      'Props and Components'
    ]
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Video Player Section */}
        <div className="lg:w-2/3">
          <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-4">
            <div className="text-white text-center">
              <p className="text-2xl mb-4">Video Player Placeholder</p>
              <p className="text-lg">Course: {course.title}</p>
              <p className="text-lg">Current Video: {course.currentVideo}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{course.currentVideo}</h1>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={() => setCurrentTime(prev => Math.max(0, prev - 300))}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-300"
              >
                -5 min
              </button>
              <button 
                onClick={() => setCurrentTime(prev => Math.min(duration, prev + 300))}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
              >
                +5 min
              </button>
              <Link 
                to={`/courses/${id}`}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-300 ml-auto"
              >
                Course Details
              </Link>
            </div>
          </div>
        </div>

        {/* Playlist Section */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Content</h2>
            <div className="space-y-2">
              {course.videos.map((video, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded cursor-pointer transition duration-300 ${
                    index === 0 
                      ? 'bg-blue-100 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <p className="font-medium">{index + 1}. {video}</p>
                  {index === 0 && <span className="text-sm text-blue-500">Currently Playing</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;