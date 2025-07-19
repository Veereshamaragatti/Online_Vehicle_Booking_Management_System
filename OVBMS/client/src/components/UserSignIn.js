import React, {useContext, useState} from 'react'
// import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from './AuthContext'

function UserSignIn() {

  const navigate = useNavigate()

  const { UserSignIn } = useContext(AuthContext)

  const [UserInfo, setUserInfo] = useState({
    email: '',
    password: ''
  })

  const [err, setErr] = useState(null)

  const handleChange = (e) => {
    setUserInfo((prev) => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await UserSignIn(UserInfo)
      // await axios.post("http://localhost:5000/UserSignIn",UserInfo, { withCredentials: true })
      alert("User Signed In Successfully")
      navigate("/")
    } catch (err) {
      setErr(err.response.data)
    }
  }

  return (
    <div>
        <div className='d-flex bg-light justify-content-center align-items-center vh-100'>
            <form className='bg-light p-4 rounded-5 shadow-lg' style={{ width: '400px' }} onSubmit={handleSubmit}> 

                <h1 className="text-center fw-bold">Sign In</h1><br/><br/>

                <input className="form-control rounded-5" onChange={handleChange} name='email' type='email' placeholder='EmailID' required/><br/>
                <input className="form-control rounded-5" onChange={handleChange} name='password' type='password' placeholder='Password' required/><br/>

                <div className='text-center'>
                    <button type="submit" className="btn btn-primary border btn-block rounded-5 w-100 fw-bold">Sign In</button><br/><br/>
                    {err && (<div className="alert alert-danger" role="alert"><strong>Error:</strong> <span className="fw-bold">{err}</span></div>)}
                </div>

                <p className="text-center mt-3">Don't have an account? <Link to='/UserSignUp'>Sign up</Link></p>
            </form>
        </div>
    </div>
  )
}

export default UserSignIn