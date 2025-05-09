// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import HomeCourses from '../components/HomeCourses'

export default function Dashboard() {
  const [limit, setLimit] = useState(9)

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

  return (
    <div className="py-4">
      <HomeCourses isHome={false} limit={limit} />
    </div>
  )
}
