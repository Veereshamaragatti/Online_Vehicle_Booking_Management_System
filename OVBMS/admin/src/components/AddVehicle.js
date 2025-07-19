import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from './AdminNavbar'
// import { Link } from 'react-router-dom'

function AddVehicle() {

    const [VehicleInfo, setVehicleInfo] = useState({
        License_No: "",
        Vehicle_Name: "",
        Model_Year: "",
        Price_Per_Day: null,
        Seating_Capacity: null,
        Fuel_Type: "",
        Vehicle_Image: "",
        Vehicle_Overview: ""
    })

    const navigate = useNavigate()

    const handleChange = (e) => {
        setVehicleInfo((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post("http://localhost:5000/AddVehicle",VehicleInfo)
            alert("New Vehicle added successfully!")
            navigate("/Admin")
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate("/AdminLogin");
            } else {
                console.log(error)
            }
        }
    }

  return (
    <div>
        <AdminNavbar />
        <div className='d-flex bg-light justify-content-center align-items-center vh-100 py-5 mt-4 px-5'>
            <form className='container bg-light p-4 rounded-5 shadow-lg'style={{ width: '500px' }} onSubmit={handleSubmit}>
                <h1 className="text-center fw-bold">Add New Vehicle</h1><br/><br/>
                <input className="form-control rounded-5" type='text' placeholder='License_No' onChange={handleChange} name='License_No' required/><br/>
                <input className="form-control rounded-5" type='text' placeholder='Vehicle_Name' onChange={handleChange} name='Vehicle_Name' required/><br/>
                <input className="form-control rounded-5" type='year' placeholder='Model_Year' onChange={handleChange} name='Model_Year' required/><br/>
                <input className="form-control rounded-5" type='number' placeholder='Price_Per_Day' onChange={handleChange} name='Price_Per_Day' required/><br/>
                <input className="form-control rounded-5" type='number' placeholder='Seating_Capacity' onChange={handleChange} name='Seating_Capacity' required/><br/>
                <input className="form-control rounded-5" type='text' placeholder='Fuel_Type' onChange={handleChange} name='Fuel_Type' required/><br/>
                <input className="form-control rounded-5" type='text' placeholder='Vehicle_Image' onChange={handleChange} name='Vehicle_Image'/><br/>
                <textarea className="form-control rounded-5" rows="3" cols="40" placeholder='Vehicle_Overview' onChange={handleChange} name='Vehicle_Overview'/><br/>
                <div className='text-center'>
                    <button type='submit' className="btn btn-primary border btn-block rounded-5 w-100 fw-bold">Add Vehicle</button>
                </div><br/>
            </form>
        </div>
    </div>
  )
}

export default AddVehicle