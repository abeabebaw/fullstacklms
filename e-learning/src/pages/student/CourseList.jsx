import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/student/SearchBar'
import { useParams, useNavigate } from 'react-router-dom'
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets'
import { 
  Filter, 
  Grid, 
  List, 
  X, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Star,
  ArrowRight,
  BookOpen,
  Search,
  BarChart3,
  Calendar
} from 'lucide-react'
import Footer from '../../components/student/Footer'

const CourseList = () => {
  const { allCourses, enrolledCourses } = useContext(AppContext)
  const navigate = useNavigate()
  const { input } = useParams()
  const [filteredCourse, setFilteredCourse] = useState([])
  const [viewType, setViewType] = useState('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])
  const [selectedLevels, setSelectedLevels] = useState([]) // ['beginner','intermediate','advanced']
  const [selectedCategories, setSelectedCategories] = useState([])

  const availableCategories = useMemo(() => {
    const set = new Set()
    ;(allCourses || []).forEach(c => {
      if (c && typeof c.courseCategory === 'string' && c.courseCategory.trim()) set.add(c.courseCategory.trim())
    })
    return Array.from(set).sort()
  }, [allCourses])

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice()

      const matched = input
        ? tempCourses.filter((item) => item.courseTitle?.toLowerCase().includes(input.toLowerCase()))
        : tempCourses

      // Apply sorting
      if (sortBy === 'newest') matched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      if (sortBy === 'price_low') matched.sort((a, b) => (a.coursePrice || 0) - (b.coursePrice || 0))
      if (sortBy === 'price_high') matched.sort((a, b) => (b.coursePrice || 0) - (a.coursePrice || 0))
      if (sortBy === 'rating') matched.sort((a, b) => {
        const ra = Array.isArray(a.courseRatings) && a.courseRatings.length > 0 ? a.courseRatings.reduce((s, r) => s + (r.rating || 0), 0) / a.courseRatings.length : 0
        const rb = Array.isArray(b.courseRatings) && b.courseRatings.length > 0 ? b.courseRatings.reduce((s, r) => s + (r.rating || 0), 0) / b.courseRatings.length : 0
        return rb - ra
      })

      // Start with matched list
      let result = matched

      // Apply level filter (expect backend to store lowercase: 'beginner'|'intermediate'|'advanced')
      if (selectedLevels.length > 0) {
        const levelsSet = new Set(selectedLevels.map(s => String(s).toLowerCase()))
        result = result.filter(c => levelsSet.has(String(c.courseLevel || '').toLowerCase()))
      }

      // Apply category filter
      if (selectedCategories.length > 0) {
        const catSet = new Set(selectedCategories)
        result = result.filter(c => catSet.has(c.courseCategory))
      }

      setFilteredCourse(result)
    }
  }, [allCourses, input, sortBy, selectedLevels, selectedCategories])

  // Maintain activeFilters count for badge
  useEffect(() => {
    const items = []
    if (selectedLevels.length > 0) items.push(...selectedLevels.map(l => `level:${l}`))
    if (selectedCategories.length > 0) items.push(...selectedCategories.map(c => `cat:${c}`))
    setActiveFilters(items)
  }, [selectedLevels, selectedCategories])

  const enrolledMap = useMemo(() => {
    const map = {}
    if (Array.isArray(enrolledCourses)) {
      enrolledCourses.forEach(c => { if (c && c._id) map[c._id] = c })
    }
    return map
  }, [enrolledCourses])

  const getSortIcon = () => {
    switch(sortBy) {
      case 'newest': return <Calendar size={16} />
      case 'rating': return <Star size={16} />
      case 'price_low': return <TrendingUp size={16} />
      case 'price_high': return <TrendingUp size={16} className="rotate-180" />
      default: return <BarChart3 size={16} />
    }
  }

  const clearAllFilters = () => {
    setSortBy('newest')
    setActiveFilters([])
    setSelectedLevels([])
    setSelectedCategories([])
    if (input) navigate('/course-list')
  }

  const stats = useMemo(() => {
    const totalCourses = allCourses?.length || 0
    const freeCourses = allCourses?.filter(c => !c.coursePrice || c.coursePrice === 0).length || 0
    const avgRating = allCourses?.reduce((acc, c) => {
      const rating = Array.isArray(c.courseRatings) && c.courseRatings.length > 0 
        ? c.courseRatings.reduce((s, r) => s + (r.rating || 0), 0) / c.courseRatings.length 
        : 0
      return acc + rating
    }, 0) / totalCourses || 0
    
    return { totalCourses, freeCourses, avgRating: avgRating.toFixed(1) }
  }, [allCourses])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/30">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Master New Skills
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mb-8">
              Explore our curated collection of {stats.totalCourses}+ courses taught by industry experts
            </p>
            <div className="max-w-2xl mx-auto md:mx-0">
              <SearchBar data={input} />
            </div>
          </div>
        </div>
      </div>

     
       
          
     
       

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              <span className="font-medium">Filters</span>
              {activeFilters.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {activeFilters.length}
                </span>
              )}
            </button>

            {input && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl">
                <Search size={16} />
                <span className="font-medium">"{input}"</span>
                <button
                  onClick={() => navigate('/course-list')}
                  className="p-1 hover:bg-blue-100 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {getSortIcon()}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
            
              
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filter Courses</h3>
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Course Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level])}
                      className={`px-4 py-2 rounded-lg border transition-colors ${selectedLevels.includes(level) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.length === 0 && (
                    <span className="text-gray-500 text-sm">No categories</span>
                  )}
                  {availableCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                      className={`px-4 py-2 rounded-lg border transition-colors ${selectedCategories.includes(cat) ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {input ? `Results for "${input}"` : 'All Courses'}
            </h2>
            <p className="text-gray-600 mt-1">
              Showing {filteredCourse.length} of {allCourses?.length || 0} courses
            </p>
          </div>
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <span>See all categories</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Courses Grid/List */}
        {filteredCourse.length > 0 ? (
          <div className={viewType === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'flex flex-col gap-4'
          }>
            {filteredCourse.map((courses, i) => (
              <CourseCard key={i} courses={courses} enrolled={enrolledMap[courses._id]} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Search className="text-blue-500" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {input ? 'No courses found' : 'No courses available'}
              </h3>
              <p className="text-gray-600 mb-8">
                {input
                  ? `We couldn't find any courses matching "${input}". Try different keywords or browse all courses.`
                  : 'New courses are being added regularly. Check back soon!'}
              </p>
              {input && (
                <button
                  onClick={() => navigate('/course-list')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <BookOpen size={18} />
                  Browse All Courses
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats Footer */}
       <Footer/>
      </div>
    </div>
  )
}

export default CourseList