import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import AdminNavbar from './AdminNavbar'
// import { Link } from 'react-router-dom'

function UpdateVehicles() {

    const [VehicleInfo, setVehicleInfo] = useState({
        License_No: "",
        Vehicle_Name: "",
        Model_Year: "",
        Price_Per_Day: 0,
        Seating_Capacity: 0,
        Fuel_Type: "",
        Vehicle_Image: "",
        Vehicle_Overview: ""
    })

    const navigate = useNavigate()
    const location = useLocation()

    const vehicle_license_no = location.pathname.split("/")[2]

    useEffect(() => {
        const fetchVehicleInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/UpdateVehicle/${vehicle_license_no}`);
                const data = response.data
                setVehicleInfo({
                    License_No: data.license_no,
                    Vehicle_Name: data.vehicle_name,
                    Model_Year: data.model_year,
                    Price_Per_Day: data.price_per_day,
                    Seating_Capacity: data.seating_capacity,
                    Fuel_Type: data.fuel_type,
                    Vehicle_Image: data.vehicle_image,
                    Vehicle_Overview: data.vehicle_overview
                });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate("/AdminLogin");
                } else {
                    console.log(error)
                }
            }
        };
        fetchVehicleInfo();
    }, [vehicle_license_no, navigate]);

    const handleChange = (e) => {
        setVehicleInfo((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.put("http://localhost:5000/UpdateVehicle/"+vehicle_license_no,VehicleInfo)
            alert(`Vehicle with License plate ${vehicle_license_no} updated Successfully!`)
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
        <div className='d-flex bg-light justify-content-center align-items-center vh-100 py-5 px-5 mt-4'>
            <form className='bg-light p-4 rounded-5 shadow-lg'style={{ width: '500px' }} onSubmit={handleSubmit}>
                <h1 className="text-center fw-bold">Update Vehicle Info</h1><br/><br/>
                <input className="form-control rounded-5" value={VehicleInfo.License_No} type='text' placeholder='License_No' onChange={handleChange} name='License_No' required/><br/>
                <input className="form-control rounded-5" value={VehicleInfo.Vehicle_Name} type='text' placeholder='Vehicle_Name' onChange={handleChange} name='Vehicle_Name' required/><br/>
                <input className="form-control rounded-5" value={VehicleInfo.Model_Year} type='year' placeholder='Model_Year' onChange={handleChange} name='Model_Year' required/><br/>
                <input className="form-control rounded-5" value={VehicleInfo.Price_Per_Day} type='number' placeholder='Price_Per_Day' onChange={handleChange} name='Price_Per_Day' required/><br/>
                <input className="form-control rounded-5" value={VehicleInfo.Seating_Capacity} type='number' placeholder='Seating_Capacity' onChange={handleChange} name='Seating_Capacity' required/><br/>
                <input className="form-control rounded-5" value={VehicleInfo.Fuel_Type} type='text' placeholder='Fuel_Type' onChange={handleChange} name='Fuel_Type' required/><br/>
                <input className="form-control rounded-5" value={VehicleInfo.Vehicle_Image} type='text' placeholder='Vehicle_Image' onChange={handleChange} name='Vehicle_Image'/><br/>
                <textarea className="form-control rounded-5" value={VehicleInfo.Vehicle_Overview} rows="3" cols="40" placeholder='Vehicle_Overview' onChange={handleChange} name='Vehicle_Overview'/><br/>
                <div className='text-center'>
                    <button type='submit' className="btn btn-primary border btn-block rounded-5 w-100 fw-bold">Update Vehicle</button>
                </div><br/>
            </form>
        </div>
    </div>
  )
}

export default UpdateVehicles