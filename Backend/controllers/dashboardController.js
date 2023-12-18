const { connectToCluster } = require('../database/connect');
const path = require('path')
const fs = require('fs')

exports.dashboardData = async (req, res) => {

    const user = req.user.email;
    try {
        const client = await connectToCluster();
        const database = client.db("Farm");
        const usersCollection = database.collection('userFilePath');
        const userDataCollection = database.collection('Users')

        const userData = await userDataCollection.find({ email: user }).toArray()
        const existingData = await usersCollection.find({ email: user }).toArray()

        if (existingData.length > 0) {
            res.status(200).json({ success: 'Data fetched successfully', data: existingData, userData });
        } else {
            res.status(404).json({ error: 'No Data found' });
        }
    } catch (error) {
        console.log("err", error);
        res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
    }

};

exports.downloadFile = async (req, res) => {
    try {
        const filename = req.params.fileName;
        const filePath = path.join('downloads', req.user.email, filename);

        try {
            const stats = await fs.promises.stat(filePath);

            if (!stats.isFile()) {
                return res.status(404).send('File not found');
            }

            // Uncomment the following lines if you want to stream the file to the response
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', 'application/octet-stream');
            
            const fileStream = fs.createReadStream(filePath);
            console.log("file str", fileStream);
            fileStream.pipe(res);

        } catch (error) {
            console.error('Error accessing file:', error);
            return res.status(500).send('Internal Server Error');
        }
    } catch (error) {
        console.error('Error during file download:', error);
        res.status(500).send('Internal Server Error');
    }
};

