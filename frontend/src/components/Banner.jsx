import React, { useState } from 'react'
import bgimage from '../assets/images/macbanner.jpg'

const Banner = ({ subtitle = 'Find Your Course' }) => {
  const [courseCode, setCourseCode] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle the form submission (e.g., API call or something else)
    console.log('Course code submitted:', courseCode)
  }

  return (
    <section
      className="relative bg-cover bg-center py-20 mb-4"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          <p className="my-4 text-2xl font-extrabold text-yellow-500 sm:text-5xl md:text-6xl">
            {subtitle}
          </p>
          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 max-w-md mx-auto w-full">
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              className="border rounded w-full py-2 px-3 mb-2"
              placeholder="e.g. MATH 2LA3"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
            <button
              type="submit"
              className="bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-600"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Banner