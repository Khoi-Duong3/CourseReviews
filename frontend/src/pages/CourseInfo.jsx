import React from 'react'
import { useParams } from 'react-router-dom'
import CourseDetailCard from '../components/CourseDetailCard'
import Review from '../components/Review'
import coursesData from '../mcmaster_courses_full.json'

export default function CourseInfo() {
  const { code = '' } = useParams()
  const key = decodeURIComponent(code).trim().toUpperCase()

  let course = null
  for (const inner of Object.values(coursesData)) {
    if (inner[key]) {
      course = inner[key]
      break
    }
  }

  if (!course) {
    return <p className="text-center mt-8 text-red-500">The course "{key}" does not exist</p>
  }

  return (
    <>
      <div className='mt-6'>
        <CourseDetailCard
          code={key}
          name={course.name}
          description={course.description}
          prereq={course.prerequisites}
          antireq={course.antirequisites}
        />
      </div>
        

      {/* Centered reviews container */}
      <main className="max-w-4xl mx-auto py-8 space-y-8">
        {/* Render Review components here, e.g. */}
        {/* reviews.map(r => <Review key={r._id} {...r} />) */}
      </main>
    </>
  )
}
