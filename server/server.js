const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const candidateRoutes = require('./routes/candidates');
const instituteRoutes = require('./routes/institutes');
const choiceRoutes = require('./routes/choices');
const commonRoutes = require('./routes/common');

// API Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/choices', choiceRoutes);
app.use('/api', commonRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'JOSAA API Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to JOSAA API Server',
    version: '1.0.0',
    endpoints: {
      candidates: '/api/candidates',
      institutes: '/api/institutes',
      choices: '/api/choices',
      allocations: '/api/allocations',
      programs: '/api/programs',
      seatMatrix: '/api/seat-matrix',
      openingClosingRanks: '/api/opening-closing-ranks',
      counsellingRounds: '/api/counselling-rounds'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
