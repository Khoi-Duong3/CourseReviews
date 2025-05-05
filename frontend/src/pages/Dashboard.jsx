import React from 'react'
import COOPS from '../components/COOPS'
import UpdateInfo from '../components/UpdateInfo'

const Dashboard = () => {
  return (
    <>
      <section className='bg-zinc-900 px-4 py-6'>
        <UpdateInfo />
        <COOPS />
      </section>
    </>
    
  )
}

export default Dashboard