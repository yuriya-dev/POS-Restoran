const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const { validateCache, invalidateCache } = require('../middleware/cache');

// GET all orders - with cache validation (5 min TTL)
router.get('/', validateCache('orders:all', 300), controller.getAll);

// POST create order - invalidate related caches
router.post('/', invalidateCache(['orders:*', 'tables:*', 'kitchen:*']), controller.create);

// GET kitchen orders - with cache validation (1 min TTL - frequent updates)
router.get('/kitchen', validateCache('kitchen:orders', 60), controller.getKitchenOrders);

// PUT complete order - invalidate cache
router.put('/:id/complete', invalidateCache(['orders:*', 'kitchen:*', 'reports:*']), controller.completeOrder);

// POST cancel order - invalidate cache
router.post('/:id/cancel', invalidateCache(['orders:*', 'kitchen:*', 'reports:*']), controller.cancelOrder);

module.exports = router;