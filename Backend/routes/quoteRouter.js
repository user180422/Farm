const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');

router.post('/createQuote', quoteController.quotes);

module.exports = router;
