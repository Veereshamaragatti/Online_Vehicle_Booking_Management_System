import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VehicleBooking() {

  const [vehicle, setVehicle] = useState({});
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation()
  const vehicle_license_no = location.pathname.split("/")[2]

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 7);
  const endDateStr = endDate.toISOString().split('T')[0];

  console.log(vehicle)

  useEffect(() => {
    const fetchVehicleInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/VehicleBooking/${vehicle_license_no}`);
        setVehicle(response.data);
      } catch (error) {
          if (error.response && error.response.status === 401) {
              navigate("/UserSignUp");
          } else {
              console.log(error)
          }
      }
    };
    fetchVehicleInfo();
  }, [vehicle_license_no]);

  const handleBooking = async (e) => {
    e.preventDefault()
    try {
      console.log(vehicle_license_no,fromDate, toDate)
      const res = await axios.post(`http://localhost:5000/VehicleBooking/${vehicle_license_no}`,{
        from_date: fromDate,
        to_date: toDate
      })
      setMessage(res.data);
      setTimeout(() => navigate('/UserProfile'), 3000);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            navigate("/UserSignUp");
        } else {
            console.log(error)
        }
    }
  }
  

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-4 px-5 py-5 fw-bold">Book {vehicle.vehicle_name}</h1>
        <div className="row d-flex align-items-stretch">
          <div className="col-md-6 d-flex">
            <img src={vehicle.vehicle_image} alt={vehicle.vehicle_name} className="img-fluid shadow-lg rounded" style={{ maxHeight: '350px', objectFit: 'cover', height: '100%', width: '100%', borderRadius: '10px' }} />
          </div>
          <div className="col-md-6 d-flex">
            <div className="card shadow p-4 w-100 d-flex mb-5">
              <div className="card-body d-flex flex-column justify-content-between" style={{ height: '100%' }}>
                <h4 className="card-title fw-bold">Vehicle Details for {vehicle.vehicle_name}</h4><br/>
                <h5><strong>Price per Day: ₹{vehicle.price_per_day} </strong></h5><br/>
                <h5><strong>Fuel Type:</strong> {vehicle.fuel_type}</h5><br/>
                <h5><strong>Seating Capacity:</strong> {vehicle.seating_capacity}</h5><br/>
                <form onSubmit={handleBooking}>
                  <div className="mb-3">
                    <label htmlFor="fromDate" className="form-label">From Date</label>
                    <input type="date" className="form-control" id="fromDate" value={fromDate} min={todayStr} max={endDateStr} onChange={(e) => setFromDate(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="toDate" className="form-label">To Date</label>
                    <input type="date" className="form-control" id="toDate" value={toDate} min={fromDate || todayStr} max={endDateStr} onChange={(e) => setToDate(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 fw-bold">Submit Booking Request</button>
                </form>
                {message && <div className="alert alert-info mt-3">{message}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleBooking