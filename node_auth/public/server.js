// server.js

const express = require('express');
const path = require('path');
const cors = require('cors');

// ✅ auth.js should be in routes folder, not public
const authRoutes = require('../routes/auth.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder to serve html / js / css
const publicPath = __dirname;
app.use(express.static(publicPath));

// Mount API route handlers
app.use('/api', authRoutes);


// Landing page after login
app.get('/i.html', (req, res) => {
  res.sendFile(path.join(publicPath, 'i.html'));
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {  
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
