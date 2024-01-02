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

exports.refund = async (req, res) => {

    console.log("body", req.body);

    const currentDate = new Date();
    const user = req.user.email;
    const { amount } = req.body;
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid refund amount. Please enter a valid number.' });
    }

    const client = await connectToCluster();
    const database = client.db("Farm");
    const userData = database.collection('Users')
    const refundCollection = database.collection('Refunds');

    const amoundBalance = await userData.findOne({ email: user })
    const amountToCheck = amoundBalance.totalPrice

    if(amount > amountToCheck) {
        return res.status(400).json({ error: 'Refund amount must be less then balance amount' });
    }

    const insertData = await refundCollection.insertOne({
        email: user,
        amound: amount,
        status: "requested",
        createdAt: currentDate
    });

    if (!insertData.insertedId || insertData.insertedId === '') {
        return res.status(500).json({ error: 'Refund request failed' });
    } 

    return res.json({ success: 'Refund request Successfull Check status on all refunds' });
};

exports.getUserRefunds = async (req, res) => {

    const user = req.user.email;

    try {
        const client = await connectToCluster();
        const database = client.db("Farm");
        const userCollection = database.collection('Refunds');

        const payment = await userCollection.find({ email: user }).toArray();

        if (!user) {
            return res.status(200).json({ error: "No Payments" })
        }

        res.json({ data: payment })
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to retrieve user payments');
    }
};

exports.getUserPayments = async (req, res) => {

    const user = req.user.email;

    try {
        const client = await connectToCluster();
        const database = client.db("Farm");
        const userCollection = database.collection('Pricing');

        const payment = await userCollection.find({ email: user }).toArray();

        if (!user) {
            return res.status(200).json({ error: "No Payments" })
        }

        res.json({ data: payment })
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to retrieve user payments');
    }
};