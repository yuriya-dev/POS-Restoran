const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');

// GET ALL USERS
exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('userId, username, fullName, role, is_active, created_at')
      .order('userId', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE USER (REGISTER)
exports.createUser = async (req, res) => {
  try {
    const { username, password, fullName, role } = req.body;

    // 1. Cek Username Duplicate
    const { data: existing } = await supabase
        .from('users')
        .select('userId')
        .eq('username', username)
        .maybeSingle(); // ✅ Gunakan maybeSingle agar tidak error jika kosong

    if (existing) {
        return res.status(400).json({ message: "Username sudah digunakan." });
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Insert
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, passwordHash, fullName, role }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, fullName, role, password } = req.body;

    // 1. Validasi Username Unik (Kecuali user ini sendiri)
    if (username) {
        const { data: existing, error: checkError } = await supabase
            .from('users')
            .select('userId')
            .eq('username', username)
            .neq('userId', id) 
            .maybeSingle(); // ✅ FIX: Gunakan maybeSingle() agar tidak throw error jika hasil 0

        if (checkError) throw checkError;

        if (existing) {
            return res.status(400).json({ message: `Username '${username}' sudah digunakan user lain.` });
        }
    }

    // 2. Siapkan data update
    const updates = {
        username,
        fullName,
        role
    };

    // 3. Cek apakah password diubah?
    if (password && password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        updates.passwordHash = await bcrypt.hash(password, salt);
    }

    // 4. Eksekusi Update
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('userId', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek user target
    const { data: targetUser, error: findError } = await supabase
        .from('users')
        .select('username')
        .eq('userId', id)
        .single();
    
    if (findError || !targetUser) {
        return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Proteksi: Jangan hapus akun 'admin' utama
    if (targetUser.username === 'admin') {
        return res.status(403).json({ message: "DILARANG: Akun Super Admin tidak boleh dihapus!" });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('userId', id);

    if (error) {
        // Handle Foreign Key Constraint
        if (error.code === '23503') { 
             return res.status(400).json({ 
                message: "Gagal hapus: User ini memiliki riwayat transaksi. Silakan non-aktifkan saja." 
            });
        }
        throw error;
    }

    res.json({ message: "User berhasil dihapus" });

  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ error: err.message });
  }
};