const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { connectToCluster } = require('../database/connect');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderName = path.join('public', 'uploads');
        fs.mkdirSync(folderName, { recursive: true });
        cb(null, folderName);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 1024 } });

exports.uploadFile = async (req, res) => {

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    const formattedDate = `${year}_${month < 10 ? '0' : ''}${month}_${day < 10 ? '0' : ''}${day}`;
    const formattedTime = `${hours < 10 ? '0' : ''}${hours}_${minutes < 10 ? '0' : ''}${minutes}_${seconds < 10 ? '0' : ''}${seconds}`;

    upload.array('files')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: 'File upload failed.' });
        }

        const folderName = path.join('public', 'uploads', req.user.email, `${formattedDate}-${formattedTime}`);

        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName, { recursive: true });
        }

        req.files.forEach(file => {
            const finalDestination = path.join(folderName, file.originalname);
            fs.renameSync(file.path, finalDestination);
            console.log(`File "${file.originalname}" moved to "${folderName}"`);
        });

        async function out() {

            try {

                const client = await connectToCluster();
                const database = client.db("Farm");
                const quotesCollection = database.collection('userFilePath');
                const insertData = await quotesCollection.insertOne({
                    email: req.user.email,
                    path: folderName,
                    status: "Submitted"
                });

                if (!insertData.insertedId || insertData.insertedId === '') {
                    return res.status(500).json({ error: 'File upload Failed' });
                } else{
                    return res.status(200).json({ success: 'File upload Successfull' });
                }

            } catch (error) {
                return res.status(500).json({ error: 'File Upload Failed' });
            }

        }

        out()

    });
};

