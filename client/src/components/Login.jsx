import React, { useState } from 'react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEmail("")
    setPassword("")
    console.log({ email, password })
    const userData = 
      { email, password };

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST', // HTTP method used for creating/sending data
        headers: {
          'Content-Type': 'application/json' // Tells the server we are sending JSON
        },
        body: JSON.stringify(userData) // Converts the JS object to a JSON string
        
      });

      const result = await response.json(); // Parses the backend's response
      console.log("Success:", result);
    } catch (error) {
      console.error("Error sending data:", error);
    }



}

return (
  <div >
    <div className='auth-page'>
      <form className='auth-card' onSubmit={handleSubmit}>

        <h1 className='auth-card__title'>Login</h1>
        <div className='auth-card__divider'></div>
        <label htmlFor="email" className='field__label'>
          Email
        </label>
        <input type="text" placeholder='email' id='email' className='field input' value={email} onChange={(e) => setEmail(e.target.value)}
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
          <a href="/Register">Not Registered ? Create a account</a>
        </div>
      </form>
    </div>
  </div>
)
}

export default Login
