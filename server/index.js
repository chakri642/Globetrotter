const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

// Import models
require('./models/Destination');
require('./models/User');
require('./models/Challenge');

// Import routes
const destinationRoutes = require('./routes/destinations');
const gameRoutes = require('./routes/game');
const userRoutes = require('./routes/users');
const challengeRoutes = require('./routes/challenges');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Routes
app.use('/api/destinations', destinationRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/users', userRoutes);
app.use('/api/challenges', challengeRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;