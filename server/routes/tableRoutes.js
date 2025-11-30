const express = require('express');
const router = express.Router();
const controller = require('../controllers/tableController');
const { validateCache, invalidateCache } = require('../middleware/cache');

// GET all tables - with cache validation (30 min TTL)
router.get('/', validateCache('tables:all', 1800), controller.getAll);

// POST create table - invalidate cache
router.post('/', invalidateCache(['tables:*']), controller.create);

// PUT update table - invalidate cache
router.put('/:id', invalidateCache(['tables:*', 'tables:detail:*']), controller.update);

// DELETE table - invalidate cache
router.delete('/:id', invalidateCache(['tables:*', 'tables:detail:*']), controller.delete);

// PUT clear table - invalidate cache
router.put('/:id/clear', invalidateCache(['tables:*']), controller.clearTable);

module.exports = router;