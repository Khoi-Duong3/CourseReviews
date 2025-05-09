import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Post({ course }) {
  const { code, name, description } = course
  const [expanded, setExpanded] = useState(false)

  // Determine text to display
  const preview = description.length > 150
    ? description.slice(0, 150) + '...'
    : description
  const displayText = expanded ? description : preview

  return (
    <article className="bg-white rounded-md shadow-md p-6 border border-gray-200 flex flex-col h-full">
      {/* Header: course code and name */}
      <header>
        <p className="text-sm text-gray-700 uppercase tracking-wide mb-1">{code}</p>
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
      </header>

      {/* Body: description with expand/collapse */}
      <div className="flex-grow">
        <p className="text-sm text-gray-700 mb-2">{displayText}</p>
        {description.length > 150 && (
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="text-red-800 text-sm font-medium focus:outline-none"
          >
            {expanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>

      {/* Footer: divider and button aligned to bottom */}
      <footer className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
        <NavLink
          to={`/courseinfo/${encodeURIComponent(code)}`}
          className="bg-red-900 text-yellow-500 font-medium py-1 px-3 rounded hover:bg-red-950"
        >
          More Details
        </NavLink>
      </footer>
    </article>
  )
}