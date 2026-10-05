const User = require('../models/User')
const bcrypt = require('bcrypt')
const generateToken = require('../services/generateToken')

const SALT = 10

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body
  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' })
  }

  const hashedPassword = await bcrypt.hash(password, SALT)
  const user = await User.create({ name, email, password: hashedPassword })
  const token = generateToken(user)

  return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } })
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  const token = generateToken(user)

  return res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
}

module.exports = { handleUserSignup, handleUserLogin }