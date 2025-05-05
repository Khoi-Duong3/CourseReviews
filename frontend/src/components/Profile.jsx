import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
        <article className='text-2xl'>
            {user?.picture && <img src={user.picture} alt={user?.name} />}
        </article>
    )
  )
}

export default Profile