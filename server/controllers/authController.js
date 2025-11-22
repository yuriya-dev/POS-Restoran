const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user berdasarkan username
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !users) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    // Verifikasi password
    const isValid = await bcrypt.compare(password, users.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    // Jangan kirim passwordHash ke frontend
    const { passwordHash, ...userData } = users;
    
    res.json({ 
      success: true, 
      user: userData 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, fullName, role } = req.body;

    // 1. Cek Username Duplikat (Penting!)
    const { data: existing } = await supabase
      .from('users')
      .select('userId')
      .eq('username', username)
      .single();

    if (existing) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert Data
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
          username, 
          passwordHash: hashedPassword, 
          fullName, 
          role 
      }])
      .select('userId, username, fullName, role')
      .single();

    if (error) throw error;
    
    res.status(201).json({ 
      success: true, 
      user: data 
    });

  } catch (err) {
    console.error("Register Error:", err); // Log error agar terlihat di terminal server
    
    // Handle error unique key user_pkey secara spesifik jika lolos cek pertama
    if (err.code === '23505') { // Kode error Postgres untuk unique violation
        return res.status(400).json({ message: 'Username atau ID sudah terdaftar.' });
    }

    res.status(500).json({ message: err.message || 'Terjadi kesalahan server' });
  }
};