import React from 'react';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import InfoForm from './pages/InfoForm';
import LoginPage from './components/LoginPage';
import { Auth0Provider } from '@auth0/auth0-react';
import Profile from './components/Profile';
import Review from './components/Review';
import CourseInfo from './pages/CourseInfo';

const domain = import.meta.env.VITE_APP_AUTH0_DOMAIN;
const clientID = import.meta.env.VITE_APP_AUTH0_CLIENT_ID;


const router = createBrowserRouter(
  createRoutesFromElements(
  <Route path='/' element={<MainLayout />} >
    <Route index element={<HomePage />} />
    <Route path='/dashboard' element={<Dashboard />} />
    <Route path='/updateinfo' element={<InfoForm />} />
    <Route path='/login' element={<LoginPage />} />
    <Route path='/test' element={<Review />} />
    <Route path='/courseinfo' element={<CourseInfo/>} />
    <Route path='/courseinfo/:code' element={<CourseInfo/>} />
  </Route>
    
  )
);

const App = () => {
  return (
  <Auth0Provider 
    domain={domain}
    clientId={clientID}
    redirectUri={window.location.origin}
  >
    <RouterProvider router={router} />
  </Auth0Provider>
  

  )
  
}

export default App