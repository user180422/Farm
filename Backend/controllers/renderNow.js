const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;
const { connectToCluster } = require('../database/connect');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {

        const folderName = path.join('uploads', req.user.email);

        try {
            await fs.mkdir(folderName, { recursive: true });
            cb(null, folderName);
        } catch (err) {
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});


const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 1024 } }).single('files');

exports.uploadFile = async (req, res) => {

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}_${(currentDate.getMonth() + 1).toString().padStart(2, '0')}_${currentDate.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}_${currentDate.getMinutes().toString().padStart(2, '0')}_${currentDate.getSeconds().toString().padStart(2, '0')}`;

    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'File upload failed', details: err.message });
            }

            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'No file provided' });
            }

            const folderName = path.join('uploads', req.user.email);
            console.log('Intermediate folder:', folderName);

            const finalDestination = path.join(folderName, file.originalname);
            await fs.rename(file.path, finalDestination);
            console.log(`File "${file.originalname}" moved to "${folderName}"`);

            const downloadFolder = path.join('downloads', req.user.email);
            await fs.mkdir(downloadFolder, { recursive: true });

            const client = await connectToCluster();
            const database = client.db('Farm');
            const quotesCollection = database.collection('userFilePath');
            const insertData = await quotesCollection.insertOne({
                email: req.user.email,
                path: finalDestination,
                status: 'submitted',
                downloadPath: '',
                created_at: formattedDate
            });

            if (!insertData.insertedId || insertData.insertedId === '') {
                return res.status(500).json({ error: 'File upload failed' });
            } else {
                return res.status(200).json({ success: 'File upload successful' });
            }
        })
    } catch (error) {
        console.error('Error during file upload:', error);
        return res.status(500).json({ error: 'File upload failed' });
    }
}

exports.subscriptionStatus = (req, res) => {
    if (req.subscriptionStatus === 'active') {
        res.json({ status: req.subscriptionStatus });
    } else {
        res.json({ status: 'inActive' });
    }
};

