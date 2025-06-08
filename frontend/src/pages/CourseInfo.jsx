import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CourseDetailCard from '../components/CourseDetailCard'
import Review from '../components/Review'

export default function CourseInfo() {
  const { code = '' } = useParams()
  const key = decodeURIComponent(code).trim().toUpperCase()

  // Course state
  const [course, setCourse] = useState(null)
  const [courseLoading, setCourseLoading] = useState(true)
  const [courseError, setCourseError] = useState(null)

  // Reviews state
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState(null)

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [difficulty, setDifficulty] = useState(3)
  const [value, setValue] = useState(3)
  const [overall, setOverall] = useState(3)

  // Fetch course details
  useEffect(() => {
    async function fetchCourse() {
      setCourseLoading(true)
      setCourseError(null)
      try {
        const res = await fetch(`/api/courses/${encodeURIComponent(key)}`)
        if (res.status === 404) {
          throw new Error(`The course "${key}" does not exist`)
        }
        if (!res.ok) throw new Error(res.statusText)
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

  // Fetch reviews
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

  // Handle submit new review
  const handleSubmitReview = (e) => {
    e.preventDefault()

    const newReview = {
      text: reviewText,
      difficulty: parseInt(difficulty, 10),
      value: parseInt(value, 10),
      overall: parseInt(overall, 10)
    }

    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: key, review: newReview }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.review) setReviews(prev => [...prev, data.review])
      })
      .catch(err => console.error('Error submitting review:', err))

    setReviewText('')
    setDifficulty(3)
    setValue(3)
    setOverall(3)
    setShowReviewForm(false)
  }

  // Loading spinner
  if (courseLoading) return <p className="text-center mt-8">Loading course...</p>
  // API or lookup errors
  if (courseError)   return <p className="text-center mt-8 text-red-500">{courseError}</p>
  // Only show "not found" once loading is done and there's no course
  if (!course && !courseLoading) return <p className="text-center mt-8 text-red-500">Course not found</p>

  return (
    <>
      <div className="mt-6">
        <CourseDetailCard
          code={key}
          name={course.name}
          description={course.description}
          prereq={course.prerequisites}
          antireq={course.antirequisites}
        />
      </div>

      <main className="max-w-4xl mx-auto py-8 space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Reviews</h3>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-6"
          >
            {showReviewForm ? 'Cancel' : 'Add Review'}
          </button>
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h4 className="text-xl font-semibold mb-4">Write a Review</h4>
            {/* form fields here */}
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
              Submit Review
            </button>
          </form>
        )}

        {reviewsLoading ? (
          <p className="text-center">Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((rev, idx) => (
            <Review
              key={idx}
              text={rev.text}
              difficulty={rev.difficulty}
              value={rev.value}
              overall={rev.overall}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </main>
    </>
  )
}
