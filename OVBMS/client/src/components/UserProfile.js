import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import { AuthContext } from './AuthContext'

function UserProfile() {
  const { CurrentUser } = useContext(AuthContext)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!CurrentUser) {
        setBookings([])
        setLoading(false)
        return
      }

      try {
        const res = await axios.get('http://localhost:5000/UserProfile', { withCredentials: true })
        const br = res.data || []

        // fetch vehicle details for each booking (to show name/image)
        const vehicles = await Promise.all(br.map(async (b) => {
          try {
            const v = await axios.get(`http://localhost:5000/VehicleBooking/${b.vehicle_id}`, { withCredentials: true })
            return { ...b, vehicle: v.data }
          } catch (e) {
            return { ...b, vehicle: null }
          }
        }))

        setBookings(vehicles)
      } catch (err) {
        console.error(err)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [CurrentUser])

  if (!CurrentUser) return (
    <div>
      <Navbar />
      <div className="container py-5 mt-5"><h3>Please sign in to view your profile.</h3></div>
    </div>
  )

  return (
    <div>
      <Navbar />
      <div className="container py-5 mt-5">
        <h2 className="mb-4">My Bookings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className="row">
            {bookings.map((b) => (
              <div key={b.request_id} className="col-md-6 mb-4">
                <div className="card shadow-sm">
                  {b.vehicle && b.vehicle.vehicle_image && (
                    <img src={b.vehicle.vehicle_image} className="card-img-top" alt={b.vehicle.vehicle_name} style={{ height: '200px', objectFit: 'cover' }} />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{b.vehicle?.vehicle_name || b.vehicle_id}</h5>
                    <p className="mb-1"><strong>Request Date:</strong> {new Date(b.request_date).toLocaleString()}</p>
                    <p className="mb-1"><strong>From:</strong> {b.from_date} <strong>To:</strong> {b.to_date}</p>
                    <p className="mb-1"><strong>Status:</strong> {b.request_status}</p>
                    {b.action_type && <p className="mb-1"><strong>Action:</strong> {b.action_type} on {b.action_date}</p>}
                    <p className="mb-0"><strong>Vehicle ID:</strong> {b.vehicle_id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile