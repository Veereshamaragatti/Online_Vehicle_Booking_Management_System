import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import Admin from "./components/Admin"
import AddVehicle from './components/AddVehicle'
import UpdateVehicle from './components/UpdateVehicle'
import AdminLogin from './components/AdminLogin'
import AddAdmin from './components/AddAdmin';
import AdminProfile from './components/AdminProfile';
import { AdminAuthContext } from './components/AdminAuthContext';
import BookingRequest from './components/BookingRequest';


export default function App() {

  const { ProtectedAdminRoute } = useContext(AdminAuthContext)
  return (
    <div className='demo'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AdminLogin/>}/>
          <Route path='/Admin' element={<ProtectedAdminRoute element={<Admin />} />} />
          <Route path='/AdminProfile' element={<ProtectedAdminRoute element={<AdminProfile />} />} />
          <Route path='/AddAdmin' element={<ProtectedAdminRoute element={<AddAdmin />} />} />
          <Route path='/AddVehicle' element={<ProtectedAdminRoute element={<AddVehicle />} />} />
          <Route path="/UpdateVehicle/:id" element={<ProtectedAdminRoute element={<UpdateVehicle />} />} />
          <Route path="/BookingRequest" element={<ProtectedAdminRoute element={<BookingRequest />} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}