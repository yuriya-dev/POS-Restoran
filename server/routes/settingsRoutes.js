const express = require('express');
const router = express.Router();
const controller = require('../controllers/settingsController');
const { validateCache, invalidateCache } = require('../middleware/cache');

// GET settings - with cache validation (1 hour TTL)
router.get('/', validateCache('settings:all', 3600), controller.getSettings);

// PUT update settings - invalidate cache
router.put('/', invalidateCache(['settings:*']), controller.updateSettings);

module.exports = router;