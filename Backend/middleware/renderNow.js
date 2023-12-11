const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

module.exports = {
    upload
};