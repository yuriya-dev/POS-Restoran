const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// CORS Configuration
// Daftar domain/origin yang diizinkan mengakses server
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://pos-admin.vercel.app',
  'https://pos-kasir.vercel.app'
  // 'http://127.0.0.1:5173', 
  // 'http://127.0.0.1:5174'
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

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});