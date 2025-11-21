const supabase = require('../config/supabase');

exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menuitems')
      .select('*')
      .order('itemId', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menuitems')
      .insert([req.body]) // req.body berisi {name, price, category, ...}
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('menuitems')
      .update(req.body)
      .eq('itemId', id) // Pastikan nama kolom sesuai DB ("itemId")
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('menuitems')
      .delete()
      .eq('itemId', id);

    if (error) throw error;
    res.json({ message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};