import React from 'react'
import Banner from '../components/Banner'
import COOPS from '../components/COOPS';
import BrowseMore from '../components/BrowseMore';

const HomePage = () => {
  return (
    <>
        <Banner />
        <COOPS isHome={true}/>
    </>
  )
}

export default HomePage