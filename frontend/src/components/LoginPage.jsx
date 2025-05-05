import React from 'react'
import loginBg from '../assets/images/maccampus.jpg'
import { useAuth0 } from '@auth0/auth0-react'

const LoginPage = () => {
  // Auth0 hooks
  const { loginWithRedirect, isAuthenticated } = useAuth0()

  return (
    <section
      className="relative w-screen h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content */}
      <div className="relative flex items-center justify-center h-full">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6">Login</h2>

          {/* If not authenticated, show button to trigger Auth0’s Universal Login */}
          {!isAuthenticated && (
            <button
              onClick={() => loginWithRedirect()}
              className="w-full bg-red-900 text-white py-2 rounded hover:bg-red-950 transition-colors"
            >
              Login
            </button>
          )}

          {/* If user is already authenticated, show a message (or redirect) */}
          {isAuthenticated && (
            <p className="text-gray-700">
              You are already logged in!
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default LoginPage