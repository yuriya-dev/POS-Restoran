const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoryController');
const { validateCache, invalidateCache } = require('../middleware/cache');

// GET all categories - with cache validation (2 hour TTL)
router.get('/', validateCache('categories:all', 7200), controller.getAll);

// POST create category - invalidate cache
router.post('/', invalidateCache(['categories:*', 'menu:*']), controller.create);

// PUT update category - invalidate cache
router.put('/:id', invalidateCache(['categories:*']), controller.update);

// DELETE category - invalidate cache
router.delete('/:id', invalidateCache(['categories:*', 'menu:*']), controller.delete);

module.exports = router;