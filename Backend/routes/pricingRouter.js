const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');
const pricingCheck = require('../middleware/pricingCheck')
const loginCheck = require('../middleware/loginCheck')

router.post('/create-checkout-session', loginCheck.authenticateToken, pricingCheck.userVerify, pricingController.checkoutSession);
router.get('/user-session', loginCheck.authenticateToken, pricingCheck.userVerify, pricingController.userSession)
router.post('/sub', loginCheck.authenticateToken, pricingCheck.userVerify, pricingController.paymentSuccess)
// router.post('/refund', loginCheck.authenticateToken, pricingCheck.userVerify, pricingController.paymentRefund)
router.get('/paymentList', loginCheck.authenticateToken, pricingCheck.userVerify, pricingController.getUserPayments)

module.exports = router;
