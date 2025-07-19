import React, { useContext, useState } from 'react'
// import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AdminAuthContext } from './AdminAuthContext'

function AdminLogin() {

  const navigate = useNavigate()

  const { AdminLogin } = useContext(AdminAuthContext)

  const [AdminInfo, setAdminInfo] = useState({
    email: '',
    password: ''
  })

  const [err, setErr] = useState(null)

  const handleChange = (e) => {
    setAdminInfo((prev) => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await AdminLogin(AdminInfo)
      // await axios.post("http://localhost:5000/AdminLogin",AdminInfo, { withCredentials: true })
      alert("Admin Signed In Successfully")
      navigate("/Admin")
    } catch (err) {
      setErr(err.response.data)
    }
  }

  return (
    <div>
        <div className='d-flex bg-light justify-content-center align-items-center vh-100'>
            <form className='bg-light p-4 rounded-5 shadow-lg'style={{ width: '400px' }} onSubmit={handleSubmit}>

                <h1 className="text-center fw-bold">Admin Login</h1><br/><br/>

                <input className="form-control rounded-5" onChange={handleChange} name='email' type='email' placeholder='Email' required/><br/>
                <input className="form-control rounded-5" onChange={handleChange} name='password' type='password' placeholder='Password' required/><br/><br/>

                <div className='text-center'>
                  <button type="submit" className="btn btn-primary border btn-block rounded-5 w-100 fw-bold">Login</button><br/><br/>
                  {err && (<div className="alert alert-danger" role="alert"><strong>Error:</strong> <span className="fw-bold">{err}</span></div>)}
                </div>
            </form>
        </div>
    </div>
  )
}

export default AdminLogin