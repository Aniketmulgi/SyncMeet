import React from 'react'
import Register from './components/Register'
import Login from './components/Login'
import Room from './pages/Room'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import MeetingLayout from './components/MeetingLayout'
import Loading from './components/Loading'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/Room' element={<ProtectedRoute><MeetingLayout /></ProtectedRoute>} />
        <Route path='/Loading' element={<Loading />} />
      </Routes>
    </div>
  )
}

export default App