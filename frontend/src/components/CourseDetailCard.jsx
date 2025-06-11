import React from 'react'
import bgimage from '../assets/images/pgcll.jpg'

export default function CourseDetailCard({ code, name, description, prereq, antireq }) {
  return (
    <section
      className="relative bg-cover bg-center py-20 mb-4"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      {/* dimming overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-55"></div>

      {/* bring this wrapper above the overlay */}
      <div className="relative z-10">
        {/* Subtitle with horizontal lines */}
        <div className="flex items-center justify-center mt-2 mb-6 space-x-4">
          <hr className="border-t border-yellow-500 w-16" />
          <span className="text-2xl font-bold text-yellow-500">
            Details
          </span>
          <hr className="border-t border-yellow-500 w-16" />
        </div>

        {/* White info card */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 text-black">
          <h1 className="text-2xl font-semibold mb-2">
            {code} — {name}
          </h1>
          <p className="text-sm mb-4">{description}</p>
          <p className="text-sm mb-2">
            <strong>Prerequisites: </strong> {prereq || 'None'}
          </p>
          <p className="text-sm">
            <strong>Antirequisites: </strong> {antireq || 'None'}
          </p>
        </div>
      </div>
    </section>
  )
}
