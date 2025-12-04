const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Initialize Redis (optional - only if Redis is available)
let redisClient;
try {
  redisClient = require('./config/redis');
  console.log('🚀 Redis initialized');
} catch (error) {
  console.warn('⚠️ Redis not available, running without cache');
}

// CORS Configuration
// Daftar domain/origin yang diizinkan mengakses server
const allowedOrigins = [
  'https://pos-kasir.vercel.app',
  'http://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Izinkan cookie/session jika nanti diperlukan
}));

// Body Parser
app.use(express.json());

// Base Route Check
app.get('/', (req, res) => {
  res.send('Server POS Restoran Running...');
});

// --- REGISTER ROUTES ---
app.use('/api/menu-items', require('./routes/menuRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/tables', require('./routes/tableRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/orders', require('./routes/orderRoutes')); 
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/shifts', require('./routes/shiftRoutes'));
app.use('/api/cache', require('./routes/cacheRoutes')); // Cache management routes

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

if (require.main === module) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, async () => {
        console.log(`Server berjalan di port ${PORT}`);
        
        if (redisClient) {
            const { warmCache } = require('./utils/cacheWarming');
            await warmCache();
        }
    });
}

module.exports = app;