// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import HomeCourses from '../components/HomeCourses'

export default function Dashboard() {
  const [limit, setLimit] = useState(9)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const API_BASE = import.meta.env.VITE_API_BASE || ""

  useEffect(() => {
    const onScroll = () => {
      
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 175
      ) {
        setLimit(l => l + 6)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
      fetch(`${API_BASE}/api/courses`)
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
  
  if (error)   {
    return <p className="text-center mt-8 text-red-500">Error: {error}</p>
  }

  return (
    <div className="py-4">
      <HomeCourses courses={courses} isHome={false} limit={limit} />
    </div>
  )
}
