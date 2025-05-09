import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'
import NavBarEverywhere from '../components/NavBarEverywhere'


const MainLayout = () => {
  return (
    <>
        <NavBar />
        <Outlet/>
    </>
  )
}

export default MainLayout