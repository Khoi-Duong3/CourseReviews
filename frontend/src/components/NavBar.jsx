import { NavLink } from "react-router-dom";
import React, { useState } from 'react';
import logo from '../assets/images/maclogo.png';
import { useAuth0 } from '@auth0/auth0-react';

const NavBar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-red-950 border-b border-white relative z-50">
      <div className="mx-auto max-w-7x1 px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            {/* Logo / Branding */}
            <NavLink to='/' className='flex flex-shrink-0 items-center mr-4'>
              <img className='h-10 w-auto' src={logo} alt='Logo' />
              <span className='hidden md:block text-yellow-500 text-2xl font-bold ml-2'>
                McCourses
              </span>
            </NavLink>

            {/* Nav / Auth Buttons */}
            <div className="md:ml-auto">
              <div className="flex space-x-2">

                {/* Home Link */}
                <NavLink
                  to='/'
                  className="text-white hover:bg-red-900 hover:text-white rounded-md px-3 py-2"
                >
                  Home
                </NavLink>

                {/* Home Link */}
                <NavLink
                  to='test'
                  className="text-white hover:bg-red-900 hover:text-white rounded-md px-3 py-2"
                >
                  Test
                </NavLink>

                {/* Auth Section */}
                {!isAuthenticated ? (
                  /* If not logged in, show login/register button */
                  <button
                    onClick={() => loginWithRedirect()}
                    className="text-white hover:bg-red-900 hover:text-white rounded-md px-3 py-2"
                  >
                    Login/Register
                  </button>
                ) : (
                  /* If logged in, show "Logged in as (email)" with dropdown */
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      onClick={handleMenuToggle}
                      className="text-white hover:bg-red-900 hover:text-white rounded-md px-3 py-2"
                    >
                      Logged in as: {' '}
                      <span className="underline">{user?.email}</span>
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
  );
};

export default NavBar;
