const express = require('express');
const router = express.Router();
const adminData = require('../controllers/adminController');

router.get('/projectData', adminData.adminPojectData);

module.exports = router;