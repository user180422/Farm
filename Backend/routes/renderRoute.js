const express = require('express');
const router = express.Router();
const pricingCheck = require('../middleware/pricingCheck')
const subscriptionCheck = require('../middleware/subscriptionCheck')
const renderController = require('../controllers/renderNow');

router.post('/uploads', pricingCheck.userVerify, renderController.uploadFile);
router.get('/subStatus', pricingCheck.userVerify, subscriptionCheck.subscriptionCheck, renderController.subscriptionStatus)

module.exports = router;