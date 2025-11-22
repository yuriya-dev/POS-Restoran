const bcrypt = require('bcrypt');

async function generateHash() {
  const hash1 = await bcrypt.hash('admin123', 10);
  const hash2 = await bcrypt.hash('kasir123', 10);
  
  console.log('Admin hash:', hash1);
  console.log('Kasir hash:', hash2);
}

generateHash();