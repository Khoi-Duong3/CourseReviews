import React from 'react'
import NavBarEverywhere from '../components/NavBarEverywhere'
import { Outlet } from 'react-router-dom'

const EverywhereElseLayout = () => {
  return (
    <>
      <NavBarEverywhere/>
      <Outlet/>
    </>
  )
}

export default EverywhereElseLayout