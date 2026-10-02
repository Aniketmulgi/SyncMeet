import React from 'react'
import Register from './components/Register'
import Login from './components/Login'
import { Route,Routes } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Register' element={<Register/>}/>
      </Routes>
    </div>
  )
}

export default App