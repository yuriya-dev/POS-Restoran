const supabase = require('../config/supabase');

exports.getAll = async (req, res) => {
  const { data, error } = await supabase.from('dining_tables').select('*').order('table_id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.create = async (req, res) => {
  const { data, error } = await supabase.from('dining_tables').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  // table_id adalah primary key di SQL tambahan tadi
  const { data, error } = await supabase.from('dining_tables').update(req.body).eq('table_id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Cek apakah meja ini pernah dipakai di transaksi (Orders)?
    const { data: used, error: checkError } = await supabase
      .from('orders')
      .select('orderId')
      .eq('table_id', id)
      .limit(1);

    if (used && used.length > 0) {
      // OPSI A: JANGAN HAPUS (Tampilkan pesan error) - Disarankan
      return res.status(400).json({ 
        message: "Gagal hapus: Meja ini memiliki riwayat transaksi. Arsipkan atau non-aktifkan statusnya saja." 
      });

      // OPSI B: HAPUS PAKSA (Hati-hati, data order akan hilang atau error jika tidak cascade)
      // Tidak disarankan untuk aplikasi keuangan/POS.
    }

    // 2. Jika aman (belum pernah dipakai), baru hapus
    const { error } = await supabase
      .from('dining_tables')
      .delete()
      .eq('table_id', id);

    if (error) throw error;
    
    res.json({ message: "Meja berhasil dihapus permanen." });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('dining_tables')
            .update({ status: 'available' })
            .eq('table_id', id);
            
        if (error) throw error;
        res.json({ message: "Meja kosong." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};