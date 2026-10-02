const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; // Fallback to 5000 if process.env.PORT is missing
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Main route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Sample API route matching your Vite proxy
app.get('/api/test', (req, res) => {
  res.json({ message: 'Connected to Express backend!' });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});