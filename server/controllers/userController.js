const supabase = require('../config/supabase');

exports.getAll = async (req, res) => {
  try {
    // Ambil data dari tabel 'users' (custom table Anda, bukan auth.users)
    const { data, error } = await supabase
      .from('users')
      .select('userId, username, fullName, role'); // Hindari select passwordHash

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};