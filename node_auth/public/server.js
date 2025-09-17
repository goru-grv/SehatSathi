// server.js

const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../routes/.env') });

const authRoutes = require('../routes/auth.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder to serve html / js / css
// Since server.js is in the 'public' directory, __dirname correctly points to 'public'.
const publicPath = __dirname;
app.use(express.static(publicPath));

// Mount API route handlers
app.use('/api', authRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {  
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`SALT_ROUNDS: ${process.env.SALT_ROUNDS}`);
});
