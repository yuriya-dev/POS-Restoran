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
    const userIdHeader = req.headers['x-user-id']; 
    
    // ✅ DEBUG: Cek apa yang diterima server di Log Render
    console.log("[DEBUG Settings] Headers:", req.headers);
    console.log("[DEBUG Settings] x-user-id received:", userIdHeader);

    // ✅ VALIDASI KETAT: Cek jika userId kosong atau string "null"/"undefined"
    if (!userIdHeader || userIdHeader === 'null' || userIdHeader === 'undefined') {
        // Pesan error lebih detail untuk debugging
        return res.status(401).json({ 
            message: `Unauthorized. Header x-user-id kosong atau tidak valid. Diterima: ${userIdHeader}`,
            debug_hint: "Cek variabel Postman {{user_id}}, pastikan tidak kosong/null."
        });
    }

    // ✅ KONVERSI KE INTEGER: Pastikan benar-benar angka
    const userId = parseInt(userIdHeader);
    if (isNaN(userId)) {
         return res.status(400).json({ message: "Format User ID salah (bukan angka)." });
    }

    // Cek apakah user ID ini valid di database?
    // Gunakan maybeSingle agar tidak error jika tidak ketemu
    const { data: userValid } = await supabase
        .from('users')
        .select('userId')
        .eq('userId', userId)
        .maybeSingle();
    
    // Jika user tidak ada (mungkin habis reset DB), set updatedBy ke NULL agar tidak error Foreign Key
    const validUpdatedBy = userValid ? userId : null;

    const updates = {
        ...req.body,
        updatedBy: validUpdatedBy, 
        updated_at: new Date().toISOString()
    };

    // Bersihkan properti yang tidak ada di kolom tabel
    delete updates.editor; 
    delete updates.configId; 

    // Sanitasi: Pastikan tidak ada string "null" yang masuk ke kolom numeric lain
    Object.keys(updates).forEach(key => {
        if (updates[key] === 'null') updates[key] = null;
    });

    // Cek existing config
    const { data: existing } = await supabase.from('settings').select('configId').limit(1).single();

    let result;
    if (!existing) {
      // Insert baru
      const { data, error } = await supabase.from('settings').insert([{ ...updates, configId: 'default' }]).select();
      if (error) throw error;
      result = data;
    } else {
      // Update
      const { data, error } = await supabase.from('settings').update(updates).eq('configId', existing.configId).select();
      if (error) throw error;
      result = data;
    }

    res.json(result[0]);
  } catch (err) {
    console.error("Settings Update Error:", err);
    res.status(500).json({ error: err.message });
  }
};