const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const pricingCheck = require('../middleware/pricingCheck')

router.get('/dashboard', pricingCheck.userVerify, dashboardController.dashboardData)

module.exports = router;
