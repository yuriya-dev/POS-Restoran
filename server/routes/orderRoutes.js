const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/kitchen', controller.getKitchenOrders);
router.put('/:id/complete', controller.completeOrder);

module.exports = router;