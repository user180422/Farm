const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pagesController');
const loginCheck = require('../middleware/loginCheck')

router.get('/loginCheck', loginCheck.authenticateToken, pageController.loginCheck);
router.get('/adminCheck', loginCheck.authenticateToken, pageController.adminCheck)

module.exports = router;
