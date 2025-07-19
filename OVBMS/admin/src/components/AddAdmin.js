import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from './AdminNavbar'

function AddAdmin() {
  
  const navigate = useNavigate()

  const [AdminInfo, setAdminInfo] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [err, setErr] = useState(null)

  const handleChange = (e) => {
    setAdminInfo((prev) => ({...prev, [e.target.name]: e.target.value}))
  }
  console.log(AdminInfo)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        await axios.post("http://localhost:5000/AddAdmin",AdminInfo)
        alert("Added Admin Successfully")
        navigate("/Admin")
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/AdminLogin");
      } else {
        setErr(err.response.data)
      }
    }
  }

  return (
    <div>
      <AdminNavbar />
        <div className='d-flex bg-light justify-content-center align-items-center vh-100 py-5'>
            <form className='bg-light p-4 rounded-5 shadow-lg'style={{ width: '400px' }} onSubmit={handleSubmit}>

                <h1 className="text-center fw-bold">Add Admin</h1><br/><br/>

                <input className="form-control rounded-5" onChange={handleChange} name='name' type='text' placeholder='Admin Name' required/><br/>
                <input className="form-control rounded-5" onChange={handleChange} name='email' type='email' placeholder='Admin Email' required/><br/>
                <input className="form-control rounded-5" onChange={handleChange} name='password' type='password' placeholder='Admin Password' required/><br/>
                
                <div className='text-center'>
                  <button type="submit" className="btn btn-primary border btn-block rounded-5 w-100 fw-bold">Add Admin</button><br/><br/>
                  {err && (<div className="alert alert-danger" role="alert"><strong>Error:</strong> <span className="fw-bold">{err}</span></div>)}
                </div>

            </form>
        </div>
    </div>
  )
}

export default AddAdmin