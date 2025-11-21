const supabase = require('../config/supabase');

exports.getSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
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
    // Kita asumsikan configId selalu 'default'
    // Cek dulu apakah row sudah ada?
    const { data: existing } = await supabase
      .from('settings')
      .select('configId')
      .eq('configId', 'default')
      .single();

    let result;
    
    if (!existing) {
      // Jika belum ada, lakukan INSERT
      const { data, error } = await supabase
        .from('settings')
        .insert([{ ...req.body, configId: 'default' }])
        .select();
      if (error) throw error;
      result = data;
    } else {
      // Jika sudah ada, lakukan UPDATE
      const { data, error } = await supabase
        .from('settings')
        .update(req.body)
        .eq('configId', 'default')
        .select();
      if (error) throw error;
      result = data;
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};