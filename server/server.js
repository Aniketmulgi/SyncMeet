require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const mongoose = require('mongoose')
const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')

const { handleUserSignup, handleUserLogin } = require('./controllers/handleSignUp')
const authentication = require('./auth/auth')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected')
}).catch((err) => {
  console.log('MongoDB error:', err)
})

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

io.use((socket, next) => {
  const token = socket.handshake.auth.token

  if (!token) {
    return next(new Error('No token'))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.user = decoded
    next()
  } catch (err) {
    next(new Error('Invalid token'))
  }
})

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id, '| user:', socket.user.email)

  socket.on('join-room', (roomId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-joined', { userId: socket.user.id, email: socket.user.email, socketId: socket.id })
  })

  socket.on('offer', ({ to, offer }) => {
    socket.to(to).emit('offer', { from: socket.id, offer })
  })

  socket.on('answer', ({ to, answer }) => {
    socket.to(to).emit('answer', { from: socket.id, answer })
  })

  socket.on('ice-candidate', ({ to, candidate }) => {
    socket.to(to).emit('ice-candidate', { from: socket.id, candidate })
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id)
  })
})

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.post('/api/signup', handleUserSignup)

app.post('/api/login', handleUserLogin)

app.get('/api/protected', authentication, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user })
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})