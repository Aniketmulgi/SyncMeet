import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <div className='auth-page'>
      <form className='auth-card' onSubmit={handleSubmit}>
        <h1 className='auth-card__title'>Create a account</h1>
        <div className='auth-card__divider'></div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <label htmlFor="email" className='field__label'>Email</label>
        <input type="text" placeholder='email' id='email' className='field input' value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="name" className='field__label'>Username</label>
        <input type='text' placeholder='Username' id="name" className='input field' value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="password" className='field__label'>Password</label>
        <input type='password' placeholder='Password' id='password' className='input' value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" className='btn btn--primary'>Submit</button>

        <div className="auth-card__footer">
          <a href="/Login">Registered? Login</a>
        </div>
      </form>
    </div>
  )
}

export default Register
