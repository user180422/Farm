const express = require('express');
const router = express.Router();
const userController = require('../controllers/registerController');

router.post('/createUser', userController.createUser);
router.get('/verify-email', userController.verifyEmail)
router.post('/login', userController.loginUser)

module.exports = router;