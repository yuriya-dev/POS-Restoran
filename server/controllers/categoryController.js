const supabase = require('../config/supabase');

exports.getAll = async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.create = async (req, res) => {
  const { data, error } = await supabase.from('categories').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

exports.update = async (req, res) => {
  const { id } = req.params; // Di URL router tetap /categories/:id tidak masalah
  const { data, error } = await supabase
    .from('categories')
    .update(req.body)
    .eq('categoryId', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('categoryId', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Category deleted" });
};