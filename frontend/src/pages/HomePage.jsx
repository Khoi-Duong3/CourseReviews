import React, { useState, useEffect } from 'react'
import Banner from '../components/Banner'
import HomeCourses from '../components/HomeCourses';

const HomePage = () => {

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/courses')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then(data => setCourses(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))

  }, [])

  if (loading) {
    return <p className="text-center mt-8">Loading courses…</p>
  }
  if (error) {
    return <p className="text-center mt-8 text-red-500">Error: {error}</p>
  }
  
  return (
    <>
        <Banner />
        <HomeCourses courses ={courses}  isHome={true}/>
    </>
  )
}

export default HomePage