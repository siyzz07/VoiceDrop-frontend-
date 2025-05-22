import React from 'react'
import { Routes,Route } from 'react-router-dom'
import IntroPage from '../pages/IntroPage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPhone'
import OtpPage from '../pages/OtpPage'
// import SignupNamePasswordPage from '../pages/SignupNamePasswordPage'

const UserRoutes = () => {
  return (
   <Routes>
    <Route path='/' element={<IntroPage/>}/>
    <Route path='/login' element={<LoginPage/>}/>
    <Route path='/signup' element={<SignupPage/>}/>
    <Route path='/otp' element={<OtpPage/>}/>
    {/* <Route path='/signup' element={<SignupNamePasswordPage/>}/> */}
   </Routes>
  )
}

export default UserRoutes
