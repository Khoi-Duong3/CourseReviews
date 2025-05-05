import React from 'react'
import { NavLink } from 'react-router-dom'

const UpdateInfo = ( {title = 'Update Information'} ) => {
  return (
    <section className='bg-zinc-800 py-20 mb-4 hover:bg-zinc-600'>
        <div className='max-w-md mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
            <div className='text-center'>
                <NavLink to='/updateinfo' className='text-4xl font-extrabold text-white sm:text-3xl md:text-4xl'>
                    {title}
                </NavLink>
            </div> 
        </div>
    </section>
  )
}

export default UpdateInfo