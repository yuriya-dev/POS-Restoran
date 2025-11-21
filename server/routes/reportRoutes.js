const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');

router.get('/top-selling', controller.getTopSellingItems);

module.exports = router;