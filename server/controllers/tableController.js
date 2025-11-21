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
  const { id } = req.params;
  const { error } = await supabase.from('dining_tables').delete().eq('table_id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Table deleted" });
};