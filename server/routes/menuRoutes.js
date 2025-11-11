const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth');

// Public routes
router.get('/items', menuController.getAllItems);
router.get('/items/category/:category', menuController.getByCategory);

// Protected routes (require authentication)
router.post('/items', auth, menuController.addItem);
router.put('/items/:id', auth, menuController.updateItem);
router.delete('/items/:id', auth, menuController.deleteItem);

module.exports = router;