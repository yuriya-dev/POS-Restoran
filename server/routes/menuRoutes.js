const express = require('express');
const router = express.Router();
const controller = require('../controllers/menuController');
const { validateCache, invalidateCache } = require('../middleware/cache');

// GET all menu items - with cache validation (1 hour TTL)
router.get('/', validateCache('menu:all', 3600), controller.getAll);

// POST create menu item - invalidate menu cache
router.post('/', invalidateCache(['menu:*', 'categories:*']), controller.create);

// PUT update menu item - invalidate menu cache
router.put('/:id', invalidateCache(['menu:*', 'menu:detail:*']), controller.update);

// DELETE menu item - invalidate menu cache
router.delete('/:id', invalidateCache(['menu:*', 'menu:detail:*']), controller.delete);

module.exports = router;