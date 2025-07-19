import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNavbar from './AdminNavbar'
import { Link, useNavigate } from 'react-router-dom'

function Admin() {
  const navigate = useNavigate()

  const [VehicleInfo, setVehicleInfo] = useState([])

  useEffect(() => {
    const fetchCarinfo = async () => {
      try {
        const res = await axios.get("http://localhost:5000/Admin")
        setVehicleInfo(res.data)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/AdminLogin");
        } else {
          console.log(error)
        }
      }
    }
    fetchCarinfo()
  }, [navigate])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Admin/${id}`)
      window.location.reload()
      alert(`Vehicle with License plate ${id} deleted successfully!`)
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
      <div className="bg-light py-5 mt-5">
        <div className="container bg-light rounded-5 py-5 mt-5 px-5 shadow-lg">
          <h1 className="text-center mb-4 fw-bold">Manage Vehicles</h1>
          <div className="row">
            {VehicleInfo.map((car) => (
              <div key={car.license_no} className="col-md-4 mb-4">
                <div className="card shadow-lg d-flex flex-column h-100">
                  <img src={car.vehicle_image} className="card-img-top" alt={car.vehicle_name} style={{ height: '250px', objectFit: 'cover', width: '100%' }} />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{car.vehicle_name}</h5>
                    <p className="card-text flex-grow-1">
                      <strong>Price/Day:</strong> ₹{car.price_per_day}<br />
                      <strong>Fuel Type:</strong> {car.fuel_type}<br />
                      <strong>Model Year:</strong> {car.model_year}<br />
                      <strong>Seating Capacity:</strong> {car.seating_capacity}
                    </p>
                    <div className="d-flex flex-column justify-content-between mt-2">
                      <Link to={`/UpdateVehicle/${car.license_no}`} className="btn btn-primary mb-2 fw-bold">Update Vehicle Info</Link>
                      <button className="btn btn-danger mb-2 fw-bold" onClick={() => handleDelete(car.license_no)}>Delete Vehicle</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <Link to="/AddVehicle" className="btn btn-success btn-lg mb-4 w-75 fw-bold">Add New Vehicle</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
