import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CourseDetailCard from '../components/CourseDetailCard'
import Review from '../components/Review'
import coursesData from '../mcmaster_courses_full.json'

export default function CourseInfo() {
  const { code = '' } = useParams()
  const key = decodeURIComponent(code).trim().toUpperCase()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewText, setReviewText] = useState('')
  const [difficulty, setDifficulty] = useState(3)
  const [value, setValue] = useState(3)
  const [overall, setOverall] = useState(3)

  // Find the department code (e.g., "COMPSCI" from "COMPSCI 1MD3")
  const department = key.split(' ')[0]

  let course = null
  for (const inner of Object.values(coursesData)) {
    if (inner[key]) {
      course = inner[key]
      break
    }
  }

  // Fetch reviews when component mounts or when code changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        // Fetch reviews from the backend
        const response = await fetch(`/api/json-reviews/${department}/${key}`)
        const data = await response.json()
        setReviews(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching reviews:', error)
        setLoading(false)
      }
    }

    if (course) {
      fetchReviews()
    }
  }, [key, department, course])

  const handleSubmitReview = (e) => {
    e.preventDefault()

    // Create the new review object
    const newReview = {
      text: reviewText,
      difficulty: parseInt(difficulty),
      value: parseInt(value),
      overall: parseInt(overall)
    }

    // Send the review to the backend
    fetch('/api/json-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        department,
        code: key,
        review: newReview
      }),
    })
        .then(response => response.json())
        .then(data => {
          if (data.review) {
            // Update the reviews list with the new review
            // Use functional update to ensure we have the latest state
            setReviews(currentReviews => [...currentReviews, data.review])
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })

    // Reset the form
    setReviewText('')
    setDifficulty(3)
    setValue(3)
    setOverall(3)
    setShowReviewForm(false)
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
          {/* Reviews header and add review button */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Reviews</h3>
            <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-6"
            >
              {showReviewForm ? 'Cancel' : 'Add Review'}
            </button>
          </div>

          {/* Review form */}
          {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h4 className="text-xl font-semibold mb-4">Write a Review</h4>

                <div className="mb-4">
                  <label htmlFor="reviewText" className="block text-gray-700 mb-2">
                    Your Review:
                  </label>
                  <textarea
                      id="reviewText"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      required
                  ></textarea>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label htmlFor="difficulty" className="block text-gray-700 mb-2">
                      Difficulty (1-5):
                    </label>
                    <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="value" className="block text-gray-700 mb-2">
                      Value (1-5):
                    </label>
                    <select
                        id="value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="overall" className="block text-gray-700 mb-2">
                      Overall (1-5):
                    </label>
                    <select
                        id="overall"
                        value={overall}
                        onChange={(e) => setOverall(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                >
                  Submit Review
                </button>
              </form>
          )}

          {/* Display reviews using the existing Review component */}
          <div className="mt-8 space-y-6">
            {loading ? (
                <p className="text-center">Loading reviews...</p>
            ) : reviews.length > 0 ? (
                reviews.map(review => (
                    <Review
                        key={review.id}
                        text={review.text}
                        difficulty={review.difficulty}
                        value={review.value}
                        overall={review.overall}
                    />
                ))
            ) : (
                <p className="text-center text-gray-500">No reviews yet. Be the first to review this course!</p>
            )}
          </div>
        </main>
      </>
  )
}