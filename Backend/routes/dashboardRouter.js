const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const pricingCheck = require('../middleware/pricingCheck')

router.get('/dashboard', pricingCheck.userVerify, dashboardController.dashboardData)
router.get('/downloadFile/:fileName', pricingCheck.userVerify, dashboardController.downloadFile)
router.post('/refund', pricingCheck.userVerify, dashboardController.refund)
router.get('/refundsList', pricingCheck.userVerify, dashboardController.getUserRefunds)
router.get('/paymentList', pricingCheck.userVerify, dashboardController.getUserPayments)

module.exports = router;
