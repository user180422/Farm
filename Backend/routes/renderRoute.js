const express = require('express');
const router = express.Router();
const pricingCheck = require('../middleware/pricingCheck')
const renderController = require('../controllers/renderNow');

router.post('/uploads', pricingCheck.userVerify, renderController.uploadFile);

module.exports = router;