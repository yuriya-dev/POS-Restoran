const supabase = require('../config/supabase');

exports.getSettings = async (req, res) => {
  try {
    
    let query = supabase.from('settings').select('*, editor:users(fullName, username)');
    
    const { data, error } = await query.single();

    if (error) {
        console.warn("Gagal join user di settings, mengambil data mentah...", error.message);
        const { data: rawData, error: rawError } = await supabase.from('settings').select('*').single();
        
        if (rawError && rawError.code !== 'PGRST116') throw rawError;
        
        return res.json(rawData || { restaurantName: 'Restoran Default', taxRate: 0.1 });
    }

    res.json(data);
  } catch (err) {
    console.error("Settings Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const userId = req.headers['x-user-id']; 

    if (!userId) {
        return res.status(401).json({ message: "User ID tidak ditemukan. Login ulang." });
    }

    const updates = {
        ...req.body,
        updatedBy: userId,
        updated_at: new Date().toISOString()
    };

    delete updates.editor; 

    const { data: existing } = await supabase.from('settings').select('configId').eq('configId', 'default').single();

    let result;
    
    if (!existing) {
      const { data, error } = await supabase.from('settings').insert([{ ...updates, configId: 'default' }]).select();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase.from('settings').update(updates).eq('configId', 'default').select();
      if (error) throw error;
      result = data;
    }

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};