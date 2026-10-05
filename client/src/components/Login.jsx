import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from './Loading'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className='auth-page'>
        <form className='auth-card' onSubmit={handleSubmit}>
          <h1 className='auth-card__title'>Login</h1>
          <div className='auth-card__divider'></div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <label htmlFor="email" className='field__label'>Email</label>
          <input type="text" placeholder='email' id='email' className='field input' value={email} onChange={(e) => setEmail(e.target.value)} />

          <label htmlFor="password" className='field__label'>Password</label>
          <input type='password' placeholder='Password' id='password' className='input' value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" className='btn btn--primary'>
            Submit {loading ? <Loading /> : ''}
          </button>

          <div className="auth-card__footer">
            <a href="/Register">Not Registered ? Create a account</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
