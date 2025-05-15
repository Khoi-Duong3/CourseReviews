import React, { useState, useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import bgimage from '../assets/images/macbanner.jpg'

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const [profile, setProfile] = useState(null)
  const [preview, setPreview] = useState(user?.picture ?? null)
  const navigate = useNavigate()
  const fileInputRef = useRef()

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
  )
}