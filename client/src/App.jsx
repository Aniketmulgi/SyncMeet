import React, { createContext, useContext, useEffect } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import Room from './pages/Room'
import { Route,Routes } from 'react-router-dom'
import MeetingLayout from './components/MeetingLayout'

const App = () => {

  
  return (
    <div>
      <Routes>
        <Route path='/' element={<MeetingLayout/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Register' element={<Register/>}/>
        <Route path='/Room' element={<MeetingLayout/>}/>

      </Routes>
    </div>
  )
}

export default App