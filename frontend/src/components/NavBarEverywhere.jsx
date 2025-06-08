import React, { useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/images/maclogo.png'
import { useAuth0 } from '@auth0/auth0-react'

export default function NavBarEverywhere() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [courseCode, setCourseCode] = useState('')
  const encodedCode = encodeURIComponent(courseCode.trim().toUpperCase())
  const linkRef = useRef(null)

  const handleMenuToggle = () => setIsMenuOpen(prev => !prev)
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      linkRef.current?.click()
    }
  }

  return (
    <nav className="bg-red-950 border-b border-white relative z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            {/* Logo / Branding */}
            <NavLink to='/' className='flex flex-shrink-0 items-center mr-4'>
              <img className='h-10 w-auto' src={logo} alt='Logo' />
              <span className='hidden md:block text-yellow-500 text-2xl font-bold ml-2'>McCourses</span>
            </NavLink>

            {/* Search Input */}
            <div className="flex-1 flex justify-center px-4">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full max-w-md bg-white text-black rounded-full py-2 px-4 focus:outline-none"
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {/* Hidden NavLink for navigation on Enter */}
              <NavLink
                ref={linkRef}
                to={`/courseinfo/${encodedCode}`}
                className="sr-only"
              >
                Search
              </NavLink>
            </div>

            
            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <NavLink to='/' className="text-white hover:bg-red-900 rounded-md px-3 py-2">
                  Home
                </NavLink>
                {isAuthenticated && (
                  <NavLink to='/profile' className="text-white hover:bg-red-900 rounded-md px-3 py-2">
                    Profile
                  </NavLink>
                )}
                

                {!isAuthenticated ? (
                  <button onClick={() => loginWithRedirect()} className="text-white hover:bg-red-900 rounded-md px-3 py-2">
                    Login/Register
                  </button>
                ) : (
                  <div className="relative inline-block text-left">
                    <button type="button" onClick={handleMenuToggle} className="text-white hover:bg-red-900 rounded-md px-3 py-2">
                      Logged in as: <span className="underline">{user?.email}</span>
                    </button>
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                        <button
                          onClick={() => logout({ returnTo: window.location.origin })}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
