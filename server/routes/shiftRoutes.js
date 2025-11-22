const express = require('express');
const router = express.Router();
const controller = require('../controllers/shiftController');

router.get('/active/:userId', controller.getCurrentShift);
router.get('/summary', controller.getShiftSummary); // Dashboard Data
router.post('/start', controller.startShift);
router.post('/end', controller.endShift);

module.exports = router;