import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [roomId, setRoomId] = useState('')
  const navigate = useNavigate()

  const handleJoin = () => {
    if (roomId.trim()) {
      navigate(`/Room?id=${roomId}`)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Join a Meeting</h2>
      <input 
        type="text" 
        placeholder="Enter Room ID" 
        value={roomId} 
        onChange={(e) => setRoomId(e.target.value)} 
      />
      <button onClick={handleJoin}>Join Room</button>
    </div>  
  )
}

export default Home