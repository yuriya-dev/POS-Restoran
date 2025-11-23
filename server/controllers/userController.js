const supabase = require('../config/supabase');

exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      // ✅ Tambahkan 'created_at' di sini agar tanggal muncul di frontend
      .select('userId, username, fullName, role, is_active, created_at') 
      .order('userId', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE: Tambahkan Logika Proteksi di Delete
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Cek User Target dulu sebelum dihapus
    const { data: targetUser, error: findError } = await supabase
        .from('users')
        .select('username')
        .eq('userId', id)
        .single();
    
    if (findError || !targetUser) {
        return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // 🛡️ SECURITY FIX: Cegah penghapusan Super Admin
    // Asumsi username super admin adalah 'admin'
    if (targetUser.username === 'admin') {
        return res.status(403).json({ message: "DILARANG: Akun Super Admin tidak boleh dihapus!" });
    }

    // 2. Lakukan penghapusan (atau Soft Delete jika masih ingin menyimpan history)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('userId', id);

    if (error) {
        // Handle Foreign Key Constraint (Jika user sudah ada transaksi)
        if (error.code === '23503') {
             return res.status(400).json({ 
                message: "Gagal hapus: User ini memiliki data transaksi/shift. Silakan non-aktifkan saja (Soft Delete)." 
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

// Tambahkan method update untuk Soft Delete / Edit Profile jika diperlukan
exports.updateUser = async (req, res) => {
    // ... (Kode update user Anda sebelumnya) ...
    // Pastikan copy paste kode update user Anda yang sudah ada di sini jika file ini menimpa file lama
    // Untuk konteks ini, saya fokuskan pada perbaikan getAll dan deleteUser
    try {
        const { id } = req.params;
        const { username, fullName, role, password } = req.body;
        const updates = { username, fullName, role };
        
        if (password && password.trim() !== "") {
            const bcrypt = require('bcrypt');
            const salt = await bcrypt.genSalt(10);
            updates.passwordHash = await bcrypt.hash(password, salt);
        }

        const { data, error } = await supabase.from('users').update(updates).eq('userId', id).select().single();
        if (error) throw error;
        res.json({ success: true, user: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};