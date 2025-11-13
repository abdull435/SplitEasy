// index.js
const express = require('express');
const app = express();
const PORT = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Test route to check if server is running
app.get('/', (req, res) => {
  res.send('Backend is running! ');
});

// Example route: get all users (dummy data)
app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
  res.json(users);
});

// Example route: create a new user
app.post('/users', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newUser = { id: Date.now(), name };
  res.status(201).json(newUser);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
