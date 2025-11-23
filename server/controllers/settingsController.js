const supabase = require('../config/supabase');

exports.getSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*, editor:users!settings_updatedBy_fkey(fullName, username)') 
      .single();

    // Jika error selain "Row not found"
    if (error && error.code !== 'PGRST116') throw error;

    // Default value jika data kosong
    const finalSettings = data || {
      restaurantName: 'Restoran Default',
      receiptInfo: 'Info Struk',
      taxRate: 0.1
    };

    res.json(finalSettings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    // Ambil User ID dari Header (dikirim oleh interceptor frontend)
    const userId = req.headers['x-user-id']; 

    if (!userId) {
        return res.status(401).json({ message: "User ID tidak ditemukan. Login ulang." });
    }

    const updates = {
        ...req.body,
        updatedBy: userId,
        updated_at: new Date().toISOString()
    };

    // Hapus properti 'editor' jika ada di body agar tidak error saat save
    delete updates.editor; 

    // Cek apakah row sudah ada
    const { data: existing } = await supabase
      .from('settings')
      .select('configId')
      .eq('configId', 'default')
      .single();

    let result;
    
    if (!existing) {
      const { data, error } = await supabase
        .from('settings')
        .insert([{ ...updates, configId: 'default' }])
        .select();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('settings')
        .update(updates)
        .eq('configId', 'default')
        .select();
      if (error) throw error;
      result = data;
    }

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};