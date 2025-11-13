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
const allocationRoutes = require('./routes/allocations');
const commonRoutes = require('./routes/common');
const authRoutes = require('./routes/auth');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/choices', choiceRoutes);
app.use('/api/allocations', allocationRoutes);
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
      auth: '/api/auth',
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
  console.error('Server Error:', err);
  
  // Database constraint errors
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete this record because it is referenced by other data',
      error: 'Foreign key constraint violation'
    });
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist',
      error: 'Foreign key constraint violation'
    });
  }
  
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      success: false,
      message: 'This data already exists in the system',
      error: 'Duplicate entry'
    });
  }
  
  // Default error response
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Database constraints have been fixed - CRUD operations should work properly now!\n`);
});

module.exports = app;
