import React, { useEffect, useState } from 'react'
import Post from './Post';
import { NavLink } from 'react-router-dom';


const HomeCourses = ({isHome = false, limit = Infinity, courses: propCourses}) => {
  const [allCourses, setAllCourses] = useState(propCourses || []);
  const [loading, setLoading] = useState(propCourses ? false : true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propCourses) return
    fetch('/api/courses')
      .then(res => {
        if (!res.ok) throw new Error(res.status)
        return res.json()
      })
      .then(data => {
        setAllCourses(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load courses')
        setLoading(false)
      })
  }, [propCourses])

  if (loading) {
    return <p className="text-center mt-8 text-yellow-500">Loading courses…</p>
  }
  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>
  }
  
  const coursesToShow = isHome ? allCourses.slice(0,6) : allCourses.slice(0, limit);

  return (
    <section className="bg-red-950 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
          Highlighted Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {coursesToShow.map((course) => (
            <Post key={course.code} course={course}/>
          ))}
        </div>
      </div>
      {isHome && (
        <div className="mt-8 text-center">
          <NavLink to='/dashboard' className="bg-yellow-500 text-black py-3 px-40 rounded hover:bg-yellow-600 inline-block">
            Browse More
          </NavLink>
        </div>
      )}
        
      
    </section>
  )
};

export default HomeCourses