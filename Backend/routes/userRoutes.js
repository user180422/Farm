const express = require('express');
const router = express.Router();
const userController = require('../controllers/registerController');

router.post('/createUser', userController.createUser);

module.exports = router;