const supabase = require('../config/supabase');

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

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, fullName, role, password } = req.body;

    // Siapkan object update
    const updates = {
      username,
      fullName,
      role
    };

    // Hanya update password jika dikirim (tidak kosong)
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updates.passwordHash = await bcrypt.hash(password, salt);
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('userId', id)
      .select('userId, username, fullName, role')
      .single();

    if (error) throw error;

    res.json({ success: true, user: data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah user ada?
    const { data: existing } = await supabase.from('users').select('userId').eq('userId', id).single();
    if (!existing) {
        return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('userId', id);

    if (error) throw error;

    res.json({ message: "User berhasil dihapus" });

  } catch (err) {
    if (err.code === '23503') {
        return res.status(400).json({ 
            message: "Gagal hapus: User ini memiliki data transaksi. Sebaiknya non-aktifkan saja." 
        });
    }
    res.status(500).json({ error: err.message });
  }
};