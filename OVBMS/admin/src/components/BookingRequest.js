import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { useNavigate } from 'react-router-dom';

function BookingRequest() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total_users: 0,
        total_vehicles: 0,
        total_bookings: 0
    });
    const [bookingRequests, setBookingRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/AdminDashboard');
                setStats(response.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate("/AdminLogin");
                } else {
                    setError("Failed to fetch dashboard statistics");
                }
            }
        };
        fetchDashboardStats();
    }, [navigate]);

    useEffect(() => {
        const fetchBookingRequests = async () => {
            try {
                const res = await axios.get('http://localhost:5000/BookingRequest')
                setBookingRequests(res.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate("/AdminLogin");
                } else {
                    console.log(error)
                    setError("Failed to fetch dashboard statistics");
                }
            }
        }
        fetchBookingRequests()
    }, [navigate])

    if (error) return (
        <>
            <AdminNavbar />
            <div className="container mt-5 pt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        </>
    );

    const handleAction = async (requestId, action) => {
        try {
            await axios.post(`http://localhost:5000/BookingRequest/${requestId}`, { action });
            window.location.reload()
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate("/AdminLogin");
            } else {
                console.log(error)
                setError("An error occurred while updating the request status");
            }
        }
    };

    return (
        <>
            <AdminNavbar />
            <div className="container mt-5 pt-5">
                <h2 className="text-center mb-4 fw-bold">Admin Dashboard</h2>
                <div className="row">
                    {/* Users Card */}
                    <div className="col-md-4 mb-4">
                        <div className="card bg-primary text-white h-100 shadow-lg">
                            <div className="card-body text-center">
                                <h5 className="card-title fw-bold">Total Users</h5>
                                <h2 className="display-4 fw-bold">{stats.total_users}</h2>
                                <p className="card-text fw-bold">Registered Users</p>
                            </div>
                        </div>
                    </div>

                    {/* Vehicles Card */}
                    <div className="col-md-4 mb-4">
                        <div className="card bg-success text-white h-100 shadow-lg">
                            <div className="card-body text-center">
                                <h5 className="card-title fw-bold">Total Vehicles</h5>
                                <h2 className="display-4 fw-bold">{stats.total_vehicles}</h2>
                                <p className="card-text fw-bold">Listed Vehicles</p>
                            </div>
                        </div>
                    </div>

                    {/* Bookings Card */}
                    <div className="col-md-4 mb-4">
                        <div className="card bg-warning text-white h-100 shadow-lg">
                            <div className="card-body text-center">
                                <h5 className="card-title fw-bold">Total Bookings</h5>
                                <h2 className="display-4 fw-bold">{stats.total_bookings}</h2>
                                <p className="card-text fw-bold">Booking Requests</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Requests */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card shadow-lg mb-5">
                            <div className="card-header">
                                <h2 className="fw-bold text-center">Booking Requests</h2>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr className='text-center'>
                                                <th>Name(License_No)</th>
                                                <th>Contact No./Email</th>
                                                <th>Vehicle Name/License_ID</th>
                                                <th>Request Date</th>
                                                <th>From Date</th>
                                                <th>To Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-center'>
                                            {bookingRequests.map(request => (
                                                <tr key={request.request_id}>
                                                    <td>{request.name}({request.license_id})</td>
                                                    <td>{request.mobile_no}/{request.email}</td>
                                                    <td>{request.vehicle_name}/{request.vehicle_id}</td>
                                                    <td>{new Date(request.request_date).toLocaleDateString()}</td>
                                                    <td>{new Date(request.from_date).toLocaleDateString()}</td>
                                                    <td>{new Date(request.to_date).toLocaleDateString()}</td>
                                                    {
                                                        request.request_status === 'Pending' ? (
                                                            <>
                                                            <td><span className='badge bg-light text-warning shadow-sm fs-6 w-100 d-inline-block text-center'>{request.request_status}</span></td>
                                                            <td>
                                                                <button
                                                                className="btn btn-success btn-sm me-2"
                                                                onClick={() => handleAction(request.request_id, 'Approve')}
                                                                >
                                                                Approve
                                                                </button>
                                                                <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => handleAction(request.request_id, 'Reject')}
                                                                >
                                                                Reject
                                                                </button>
                                                            </td>
                                                            </>
                                                        ) : (
                                                            <td colSpan={2}>
                                                                <span className={`badge bg-light shadow-sm fs-6 w-100 d-inline-block text-center ${request.request_status === 'Approved' ? 'text-success' : request.request_status === 'Completed' ? 'text-primary' : 'text-danger'}`}>
                                                                    {request.request_status}
                                                                </span>
                                                            </td>
                                                        )
                                                    }
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BookingRequest; 