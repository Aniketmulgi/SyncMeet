import React, { useState } from 'react'
import '../index.css'

const Register = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ email, username, password })
  }

  return (
    <div className='auth-page'>
      <form className='auth-card' onSubmit={handleSubmit}>
        <h1 className='auth-card__title'>Create a account</h1>
        <div className='auth-card__divider'></div>

        <label htmlFor="email" className='field__label'>
          Email
        </label>
        <input type="text" placeholder='email' id='email' className='field input' value={email} onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="username" className='field__label'>
          Username
        </label>
        <input type='text' placeholder='Username' id="username" className='input field' value={username} onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password" className='field__label'>
          Password
        </label>
        <input type='password' placeholder='Password' id='password' className='input' value={password} onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className='btn btn--primary'>
          Submit
        </button>

        <div className="auth-card__footer">
          <a href="/Login">Registered? Login</a>
        </div>
      </form>
    </div>
  )
}

export default Register
