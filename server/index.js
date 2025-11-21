const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Middleware
app.use(cors()); 
app.use(express.json());

// --- REGISTER ROUTES ---
app.use('/api/menu-items', require('./routes/menuRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/tables', require('./routes/tableRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// ✅ PERBAIKAN: Nyalakan Orders dan Tambahkan Users
app.use('/api/orders', require('./routes/orderRoutes')); 
app.use('/api/users', require('./routes/userRoutes'));

// Base Route Check
app.get('/', (req, res) => {
  res.send('Server POS Restoran Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});