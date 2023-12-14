const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');
const pricingCheck = require('../middleware/pricingCheck')

router.post('/create-checkout-session', pricingCheck.userVerify, pricingController.checkoutSession);
router.get('/user-session', pricingCheck.userVerify, pricingController.userSession)
router.post('/sub', pricingCheck.userVerify, pricingController.paymentSuccess)

module.exports = router;
