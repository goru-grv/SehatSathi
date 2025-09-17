// routes/auth.js

const express = require('express');
const router = express.Router();
const pool = require('./db');   // Adjust if db.js is somewhere else
const bcrypt = require('bcrypt');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

// Helper function for email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  try {
    // Query DB for the email
    const [rows] = await pool.execute(
      'SELECT id, name, password_hash FROM users WHERE email = ?', 
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Login successful → send JSON response with redirect URL
    return res.status(200).json({ message: 'Login successful', redirect: '/i.html' });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    console.log('Received:', { name, email }); // Avoid logging password
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new user into database
    await pool.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );

    // Signup successful → send JSON response
    return res.status(201).json({ message: 'Signup successful', redirect: '/login.html' });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
