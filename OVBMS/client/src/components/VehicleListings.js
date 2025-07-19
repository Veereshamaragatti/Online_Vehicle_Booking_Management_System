import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'
import { AuthContext } from './AuthContext'

function VehicleListings() {
  const { CurrentUser } = useContext(AuthContext)
  const [VehicleInfo, setVehicleInfo] = useState([])

  useEffect(() => {
    const fetchCarinfo = async () => {
      try {
        const res = await axios.get("http://localhost:5000/VehicleListings")
        setVehicleInfo(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCarinfo()
  }, [])

  return (
    <div>
      <Navbar />
      <div className="bg-light py-5 mt-5">
        <div className="container bg-light rounded-5 py-5 mt-5 px-5 shadow-lg">
          <h1 className="text-center mb-4 fw-bold">Vehicle Listings</h1>
          <div className="row">
            {VehicleInfo.map((car) => (
              <div key={car.license_no} className="col-md-4 mb-4">
                <div className="card shadow-lg d-flex flex-column h-100">
                  <img src={car.vehicle_image} className="card-img-top" alt={car.vehicle_name} style={{ height: '250px', objectFit: 'cover', width: '100%' }} />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{car.vehicle_name}</h5>
                    <p className="card-text flex-grow-1">
                      <strong className={`badge bg-light shadow-sm fs-6 d-inline-block text-center ${car.availability === 'Available' ? 'text-success' : 'text-warning'}`}>{car.availability}</strong><br/>
                      <strong>Price/Day:</strong> ₹{car.price_per_day}<br />
                      <strong>Fuel Type:</strong> {car.fuel_type}<br />
                      <strong>Model Year:</strong> {car.model_year}<br />
                      <strong>Seating Capacity:</strong> {car.seating_capacity}
                    </p>
                    {CurrentUser ? (
                      <Link to={`/VehicleBooking/${car.license_no}`} className="btn btn-primary mb-2 w-100 fw-bold">Book Now</Link>
                    ) : (
                      <Link to="/UserSignIn" className="btn btn-secondary mb-2 w-100 fw-bold">Sign In to Book</Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleListings
