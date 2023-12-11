const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const renderController = require('../controllers/renderNow');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderName = `uploads/${Date.now()}`;
        fs.mkdirSync(folderName, { recursive: true });
        cb(null, folderName);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
const uploadFiles = upload.array('files');
router.post('/uploads', uploadFiles, renderController.uploadFile);
module.exports = router;