const db = require('../config/db');

const menuController = {
  // Get all menu items
  getAllItems: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM menu_items WHERE is_active = 1');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add new menu item
  addItem: async (req, res) => {
    const { name, price, category, description, image_url } = req.body;
    try {
      const [result] = await db.query(
        'INSERT INTO menu_items (name, price, category, description, image_url) VALUES (?, ?, ?, ?, ?)',
        [name, price, category, description, image_url]
      );
      res.status(201).json({ id: result.insertId, message: 'Menu item added successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update menu item
  updateItem: async (req, res) => {
    const { id } = req.params;
    const { name, price, category, description, image_url, is_active } = req.body;
    try {
      await db.query(
        'UPDATE menu_items SET name = ?, price = ?, category = ?, description = ?, image_url = ?, is_active = ? WHERE id = ?',
        [name, price, category, description, image_url, is_active, id]
      );
      res.json({ message: 'Menu item updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Soft delete menu item
  deleteItem: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('UPDATE menu_items SET is_active = 0 WHERE id = ?', [id]);
      res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get items by category
  getByCategory: async (req, res) => {
    const { category } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM menu_items WHERE category = ? AND is_active = 1', [category]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = menuController;