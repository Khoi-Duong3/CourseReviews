import React from 'react'
import Banner from '../components/Banner'
import HomeCourses from '../components/HomeCourses';

const HomePage = () => {
  return (
    <>
        <Banner />
        <HomeCourses isHome={true}/>
    </>
  )
}

export default HomePage