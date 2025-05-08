import React from 'react'

export default function CourseDetailCard({ code, name, description, prereq, antireq }) {
  return (
    <section className="bg-red-950 px-4 py-6">
      {/* Subtitle with horizontal lines above card */}
      <div className="flex items-center justify-center mt-2 mb-6 space-x-4">
        <hr className="border-t border-yellow-500 w-16" />
        <span className="text-xl font-extrabold text-yellow-500">Details</span>
        <hr className="border-t border-yellow-500 w-16" />
      </div>

      {/* White info card */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 text-black">
        <h1 className="text-2xl font-bold mb-2">
          {code} — {name}
        </h1>
        <p className="mb-4">{description}</p>
        {prereq && (
          <p className="text-sm mb-2">
            <strong>Prerequisites:</strong> {prereq}
          </p>
        )}
        {antireq && (
          <p className="text-sm">
            <strong>Antirequisites:</strong> {antireq}
          </p>
        )}
      </div>
    </section>
  )
}
