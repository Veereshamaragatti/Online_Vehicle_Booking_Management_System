import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import VehicleListings from "./components/VehicleListings"
import UserSignIn from './components/UserSignIn'
import UserSignUp from './components/UserSignUp'
import UserProfile from './components/UserProfile';
import VehicleBooking from './components/VehicleBooking';
import { AuthContext } from './components/AuthContext';


export default function App() {

  const { ProtectedUserRoute } = useContext(AuthContext)
  return (
    <div className='demo'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VehicleListings/>} />
          <Route path='/UserSignIn' element={<UserSignIn/>}/>
          <Route path='/UserSignUp' element={<UserSignUp/>}/>
          <Route path='/UserProfile' element={<ProtectedUserRoute element={<UserProfile />} />} />
          <Route path='/VehicleBooking/:id' element={<ProtectedUserRoute element={<VehicleBooking />} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}