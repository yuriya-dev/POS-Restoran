const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});