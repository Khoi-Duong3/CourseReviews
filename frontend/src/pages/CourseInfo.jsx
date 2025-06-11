import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CourseDetailCard from '../components/CourseDetailCard'
import Review from '../components/Review'
import { useAuth0 } from '@auth0/auth0-react'
import ReviewForm from '../components/ReviewForm'

export default function CourseInfo() {
  const { code = '' } = useParams()
  const key = decodeURIComponent(code).trim().toUpperCase()
  const { isAuthenticated, user } = useAuth0()

  // Course state
  const [course, setCourse]                 = useState(null)
  const [courseLoading, setCourseLoading]   = useState(true)
  const [courseError, setCourseError]       = useState(null)

  // Reviews state
  const [reviews, setReviews]               = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError]     = useState(null)

  // Control form visibility
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Profile state
  const [profile, setProfile] = useState(null)

  // Fetch user profile on login
  useEffect(() => {
    if (!isAuthenticated) return
    fetch(`/api/profile/${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(setProfile)
      .catch(console.error)
  }, [isAuthenticated, user])

  // Fetch course details
  useEffect(() => {
    async function fetchCourse() {
      setCourseLoading(true)
      setCourseError(null)
      try {
        const res = await fetch(`/api/courses/${encodeURIComponent(key)}`)
        if (res.status === 404) throw new Error(`The course "${key}" does not exist`)
        if (!res.ok)          throw new Error(res.statusText)
        const data = await res.json()
        setCourse(data)
      } catch (err) {
        console.error('Error fetching course:', err)
        setCourseError(err.message)
        setCourse(null)
      } finally {
        setCourseLoading(false)
      }
    }
    if (key) fetchCourse()
  }, [key])

  // Fetch reviews for this course
  useEffect(() => {
    async function fetchReviews() {
      setReviewsLoading(true)
      try {
        const res = await fetch(`/api/reviews/${encodeURIComponent(key)}`)
        if (!res.ok) throw new Error(res.statusText)
        const data = await res.json()
        setReviews(data)
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setReviewsError(err.message)
      } finally {
        setReviewsLoading(false)
      }
    }
    if (key) fetchReviews()
  }, [key])

  // Submit a new review (and close form)
  const handleSubmitReview = async ({ text, difficulty, value, overall, grade }) => {
    if (!profile) return
    const payload = {
      email:     profile.email,
      firstName: profile.firstName,
      lastName:  profile.lastName,
      code,
      text,
      difficulty,
      value,
      overall,
      grade,
      createdAt: new Date().toISOString()
    }
    try {
      const res = await fetch('/api/reviews', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      })
      const { review } = await res.json()
      setReviews(prev => [...prev, review])
      setShowReviewForm(false)
    } catch (err) {
      console.error('Error submitting review:', err)
    }
  }

  // Loading and error states
  if (courseLoading) return <p className="text-center mt-8">Loading course...</p>
  if (courseError)   return <p className="text-center mt-8 text-red-500">{courseError}</p>
  if (reviewsError)  return <p className="text-center mt-8 text-red-500">{reviewsError}</p>
  if (!course && !courseLoading) return <p className="text-center mt-8 text-red-500">Course not found</p>

  return (
    <>
      {/* Course detail banner */}
      <div className="mt-6">
        <CourseDetailCard
          code={key}
          name={course.name}
          description={course.description}
          prereq={course.prerequisites}
          antireq={course.antirequisites}
        />
      </div>

      {/* Reviews section with a full-width red background and sticky bottom fill */}
      <section className="bg-red-950 py-10 px-4 pb-60">
        <div className="container-xl lg:container m-auto space-y-8">
          {isAuthenticated && (
            <>
              <div className="flex items-center justify-center mb-6">
                <hr className="border-t border-yellow-500 w-16" />
                <h3 className="mx-4 text-2xl font-bold text-yellow-500">Reviews</h3>
                <hr className="border-t border-yellow-500 w-16" />
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowReviewForm(f => !f)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded mb-6"
                >
                  {showReviewForm ? 'Cancel' : 'Add Review'}
                </button>
              </div>
              {showReviewForm && (
                <div className="max-w-3xl mx-auto">
                  <ReviewForm onSubmitReview={handleSubmitReview} />
                </div>
              )}
            </>
          )}

          {reviewsLoading ? (
            <p className="text-center text-gray-200">Loading reviews…</p>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((rev, idx) => (
                <Review key={idx} mode="display" {...rev} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-200">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </section>
    </>
  )
}
