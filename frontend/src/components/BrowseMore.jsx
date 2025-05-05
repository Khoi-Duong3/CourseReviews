import React from 'react'
import { NavLink } from 'react-router-dom'

const BrowseMore = () => {
  return (
    <section className="w-full bg-zinc-900 py-20">
        <div className="m-auto max-w-lg px-6">
            <NavLink to='/dashboard' className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700">
                Browse More
            </NavLink>
        </div>        
    </section>
  )
}

export default BrowseMore