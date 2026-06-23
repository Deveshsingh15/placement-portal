// index.js - Main Express server entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Validate required environment variables for auth and database
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'ADMIN_SECRET'];
const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);
if (missingEnvVars.length) {
  console.error(`❌ Missing required env vars: ${missingEnvVars.join(', ')}`);
}
console.log(`CLIENT_URL=${process.env.CLIENT_URL || 'not set'}`);

// Connect to database
connectDB();

// Middleware
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'].filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const message = `CORS policy: Origin ${origin} is not allowed. Set CLIENT_URL in server env or add your frontend host to allowedOrigins.`;
    console.warn(message);
    return callback(new Error(message), false);
  },
  credentials: true,
};

if (!process.env.CLIENT_URL && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: CLIENT_URL is not configured. Production frontend origins may be blocked by CORS.');
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Static files for resume uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dsa', require('./routes/dsa'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Placement Portal API is running 🚀', timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 API: http://localhost:${PORT}/api/health\n`);
});
