const express = require('express');
const router = express.Router();
const userController = require('../controllers/registerController');

router.post('/createUser', userController.createUser);
router.get('/verify-email', userController.verifyEmail)
router.post('/login', userController.loginUser)
router.post('/forgot-password', userController.fargetPassword) 
router.get('/check-token', userController.checktoken)
router.post('/reset-password', userController.newPassword)

module.exports = router;