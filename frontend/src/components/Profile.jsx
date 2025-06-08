import React, { useState, useRef, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import bgimage from '../assets/images/maccampus.jpg'

export default function Profile() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(user.picture || null)

  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;
  
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(
          `/api/profile/${encodeURIComponent(user.email)}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setProfile(data);
        if (data.picture) setPreview(data.picture);
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    })();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  if (isLoading) return <p className="text-center mt-8 text-yellow-500">Loading...</p>

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = e => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(file)
      // TODO: upload file to server or Auth0 metadata
    }
  }

  return (
    isAuthenticated && (
      <section
        className="relative bg-cover bg-center py-20 mb-4"
        style={{ backgroundImage: `url(${bgimage})` }}
      >
        
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full text-black flex flex-col">
            <h2 className="text-3xl font-extrabold mb-6 text-red-950 text-center">
              Your Profile
            </h2>
            
            <div className="flex flex-col md:flex-row items-center md:justify-start md:space-x-2">
              
              <div className="flex-1 space-y-4">
                <p><strong>First Name:</strong> {profile.firstName || 'None'}</p>
                <p><strong>Last Name:</strong> {profile.lastName || 'None'}</p>
                <p><strong>Email:</strong> {profile.email || 'None'}</p>
                <p><strong>Major:</strong> {profile.major || 'None'}</p>
                <p><strong>Level of Study:</strong> {profile.levelOfStudy || 'None'}</p>
              </div>

              
              <div className="mt-6 md:mt-0 md:ml-0">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  onClick={handleImageClick}
                  className="focus:outline-none"
                >
                  <img
                    src={preview}
                    alt={`${user.firstName || user.name}'s profile`}
                    className="w-24 h-24 rounded-full border-2 border-gray-300"
                  />
                </button>
                <p className="text-center mt-2 text-sm text-gray-600">Click to change</p>
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
  )
}
