const { connectToCluster } = require('../database/connect');

exports.quotes = async (req, res) => {
    try {
        const { name, email, countryCode, phone, quote } = req.body;

        if (!name || !email || !countryCode || !phone || !quote) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const phoneRegex = /^\d{10}$/; 
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }

        const client = await connectToCluster();
        const database = client.db("Farm");
        const quotesCollection = database.collection('Quotes');
        const insertData = await quotesCollection.insertOne({
            name,
            email,
            countryCode,
            phone,
            quote
        });

        console.log("insertData", insertData);
        if (!insertData.insertedId || insertData.insertedId === '') {
            return res.status(500).json({ error: 'Quote insertion failed' });
        }

        res.status(200).json({ success: 'Quote submitted successfully' });

    } catch (error) {
        console.error('Error handling quote submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};
