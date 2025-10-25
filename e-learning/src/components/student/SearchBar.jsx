import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ data }) => {
  const navigate = useNavigate()
  const [input, setInput] = useState(data ? data : '')

  const onSearchHandler = (e) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    if (trimmedInput) {
      navigate(`/course-list/${trimmedInput}`)
    } else {
      navigate('/course-list')
    }
  }

  return (
    <form
      onSubmit={onSearchHandler}
      className="mx-auto max-w-xl w-full md:h-14 h-12 flex items-center
       bg-white border border-gray-300 rounded shadow-sm overflow-hidden"
    >
      <img
        className="md:w-10 w-8 px-3"
        src={assets.search_icon}
        alt="search icon"
      />
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        className="w-full h-full outline-none text-gray-700 px-2 text-sm"
        type="text"
        placeholder="Search for courses..."
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-none text-white md:px-10 px-6 md:py-3 py-2"
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar
