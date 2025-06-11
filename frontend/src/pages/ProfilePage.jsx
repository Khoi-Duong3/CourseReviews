import React, { useState, useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import bgimage from '../assets/images/macbanner.jpg'
import Review from '../components/Review'

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const [profile, setProfile] = useState(null)
  const [preview, setPreview] = useState(user?.picture ?? null)
  const navigate = useNavigate()
  const fileInputRef = useRef()

  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState(null)

  const emailKey = isAuthenticated && user?.email ? encodeURIComponent(user.email) : null;

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`/api/profile/${encodeURIComponent(user.email)}`)
        .then(r => r.ok ? r.json() : Promise.reject(r.status))
        .then(data => {
          setProfile(data)
          if (data.picture) setPreview(data.picture)
        })
        .catch(() => {
          setProfile({
            firstName: (user.name||"").split(" ")[0],
            lastName: "",
            major: "",
            levelOfStudy: ""
          })
          setPreview(user.picture || null)
        })
    }
  }, [isAuthenticated, user])

  useEffect(() => {
      async function fetchReviews() {
        setReviewsLoading(true)
        setReviewsError(null)
        try {
          const res = await fetch(`/api/reviews/users/${emailKey}`)
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
      if (isAuthenticated && emailKey) {
        fetchReviews()
      }
    }, [isAuthenticated, emailKey])

  if (isLoading || profile === null) {
    return <p className="text-center mt-8 text-yellow-700">Loading...</p>
  }

  const handleImageClick = () => fileInputRef.current?.click()

  const handleFileChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(file)
    // TODO: POST to backend to save under profile.picture
  }

  return (
    <>
      <section
        className="relative bg-cover bg-center py-20 mb-4"
        style={{ backgroundImage: `url(${bgimage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full flex flex-col">
            <h2 className="text-3xl font-extrabold mb-6 text-red-950 text-center">
              Your Profile
            </h2>
            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              {/* left: info */}
              <div className="flex-1 space-y-4 text-black">
                <p><strong>First Name:</strong> {profile.firstName || 'None'}</p>
                <p><strong>Last Name:</strong> {profile.lastName || 'None'}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Major:</strong> {profile.major || 'None'}</p>
                <p><strong>Level of Study:</strong> {profile.levelOfStudy || 'None'}</p>
              </div>

              {/* right: picture */}
              <div className="flex-shrink-0 text-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button onClick={handleImageClick} className="focus:outline-none">
                  <img
                    src={preview || user.picture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-2 border-gray-300"
                  />
                </button>
                <p className="mt-2 text-sm text-gray-600">Click to change</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/updateinfo')}
                className="bg-yellow-500 text-black py-2 px-6 rounded hover:bg-yellow-600"
              >
                Update Information
              </button>
            </div>
          </div>
        </div>
      </section>

    <section className="bg-red-950 py-10 px-4 pb-80">
      <div className="flex items-center justify-center mb-6">
        <hr className="border-t border-yellow-500 w-16" />
        <h3 className="mx-4 text-2xl font-bold text-yellow-500">Reviews</h3>
        <hr className="border-t border-yellow-500 w-16" />
      </div>
      <div>
        {reviewsLoading ? (
            <p className="text-center text-gray-200">Loading reviews…</p>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((rev, idx) => (
                <Review key={idx} mode="display" {...rev} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-200">No reviews yet. Go leave a review!</p>
          )}
      </div>
    </section>
    
    </> 
  )
}