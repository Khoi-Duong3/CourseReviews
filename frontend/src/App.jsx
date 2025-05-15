import React, { useEffect } from 'react'
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LoginPage from './components/LoginPage';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import CourseInfo from './pages/CourseInfo';
import EverywhereElseLayout from './layouts/EverywhereElseLayout';
import ProfilePage from './pages/ProfilePage';
import UpdateInfo from './pages/UpdateInfo'


const domain = import.meta.env.VITE_APP_AUTH0_DOMAIN;
const clientID = import.meta.env.VITE_APP_AUTH0_CLIENT_ID;


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element={<MainLayout />} >
      <Route index element={<HomePage />} />
    </Route>
    
    <Route path='/*' element={<EverywhereElseLayout/>}>
      <Route path='courseinfo' element={<CourseInfo/>}/>
      <Route path='courseinfo/:code' element={<CourseInfo/>} />
      <Route path='login' element={<LoginPage />} />
      <Route path='test' element={<ProfilePage />} />
      <Route path='dashboard' element={<Dashboard />} />
      <Route path='updateinfo' element={<UpdateInfo />} />
    </Route>
  </>
  )
);

function ProfileOnLogin() {
  const { user, isAuthenticated } = useAuth0()

  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      return
    }

    const key = `seeded:${user.email}`
    if(sessionStorage.getItem(key)){
      return
    }

    sessionStorage.setItem(key, '1')

    const [firstName] = (user.name || '').split(' ')

    fetch(`/api/profile/${encodeURIComponent(user.email)}`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        firstName,
        lastName: '',
        major: '',
        levelOfStudy: ''
      }),
    }).catch(console.error)
  }, [isAuthenticated, user])
  return null
}

const App = () => {
  return (
  <Auth0Provider 
    domain={domain}
    clientId={clientID}
    redirectUri={window.location.origin}
    cacheLocation='localstorage'
    useRefreshTokens={true}
  >
    <ProfileOnLogin />
    <RouterProvider router={router} />
  </Auth0Provider>
  

  )
  
}

export default App