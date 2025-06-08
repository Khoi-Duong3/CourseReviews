import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import bgimage from '../assets/images/maccampus.jpg'

export default function UpdateInfoPage() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()

  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [major, setMajor] = useState('')
  const [levelOfStudy, setLevelOfStudy] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      return
    }

    fetch(`/api/profile/${encodeURIComponent(user.email)}`)
    .then (result => result.json())
    .then (profile => {
        setFirstName   (profile.firstName   || '')
        setLastName    (profile.lastName    || '')
        setMajor       (profile.major       || '')
        setLevelOfStudy(profile.levelOfStudy|| '')
    })
    .catch(err => console.error('Could not load profile: ', err))
  }, [isAuthenticated, user])

  if (isLoading) return <p className="text-center mt-8 text-white">Loading...</p>
  if (!isAuthenticated) {
    navigate('/')
    return null
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const token = await getAccessTokenSilently()
      const result = await fetch(
        `/api/profile/${encodeURIComponent(user.email)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ firstName, lastName, major, levelOfStudy })
        }
      )
      if (!result.ok) {
        throw new Error(result.statusText)
      }
      const updated = await result.json()
      console.log('Updated profile from server:', updated)
  
      toast.success('Profile updated successfully')
      navigate('/profile')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update profile')
    }
  }

  return (
    <section
      className="relative w-screen h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Centered form card */}
      <div className="relative flex items-center justify-center h-full">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6">Update Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-left">
              <label className="block text-gray-700 font-semibold mb-2">First Name</label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Enter first name"
              />
            </div>

            <div className="mb-4 text-left">
              <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Enter last name"
              />
            </div>

            <div className="mb-4 text-left">
              <label className="block text-gray-700 font-semibold mb-2">Major</label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3"
                value={major}
                onChange={e => setMajor(e.target.value)}
                placeholder="Your major"
              />
            </div>

            <div className="mb-4 text-left">
              <label className="block text-gray-700 font-semibold mb-2">Level of Study</label>
              <select
                className="border rounded w-full py-2 px-3"
                value={levelOfStudy}
                onChange={e => setLevelOfStudy(e.target.value)}
              >
                <option value="">None</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
