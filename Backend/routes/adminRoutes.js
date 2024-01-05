const express = require('express');
const router = express.Router();
const adminData = require('../controllers/adminController');

router.get('/projectData', adminData.adminPojectData);
router.get('/userDetail/:id', adminData.userDetail);
router.post('/refundStatusUpdate', adminData.refundStatusUpdate)

module.exports = router;