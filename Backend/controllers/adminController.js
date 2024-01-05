const { connectToCluster } = require('../database/connect');
const { ObjectId } = require('mongodb');

exports.adminPojectData = async (req, res) => {

    try {

        const client = await connectToCluster();
        const database = client.db("Farm");

        // project
        const projectCollection = database.collection('userFilePath');
        const allProjects = await projectCollection.find({}).toArray();

        let totalCount = allProjects.length
        let completedCount = 0;
        let failedCount = 0;
        let processCount = 0;

        allProjects.forEach(project => {
            const status = project.status;

            if (status === 'completed') {
                completedCount++;
            } else if (status === 'failed') {
                failedCount++;
            } else if (status === 'process') {
                processCount++;
            }
        });

        // project
        const userCollection = database.collection('Users');
        const users = await userCollection.find({role: 'user'}).toArray();

        // console.log("users", users);

        let totalPricesSum = 0;
        let usedPrice = 0
        users.forEach(user => {
            if (user.totalPrice) {
                totalPricesSum += user.totalPrice;
            }
            if (user.priceUsed) {
                usedPrice += user.priceUsed
            }
        });

        // refund
        const refunCollection = database.collection('Refunds');
        const refunds = await refunCollection.find({}).toArray();

        let refundAmount = 0;
        refunds.forEach(refund => {
            console.log();
            if (refund.status == 'completed') {
                refundAmount += refund.amound;
            }
        });

        // quotes
        const quotesCollection = database.collection('Quotes');
        const quotes = await quotesCollection.find({}).sort({ createdAt: -1 }).toArray();

        // console.log("quotes", quotes);

        res.status(200).json({
            success: true,
            message: 'Data fetched successfully',
            data: {
                statusCounts: {
                    totalCount: totalCount,
                    completed: completedCount,
                    failed: failedCount,
                    process: processCount,
                },
                totalAmount: totalPricesSum,
                usedPrice: usedPrice,
                refundAmount: refundAmount,
                quotesData: quotes,
                users: users
            }
        });

    } catch (error) {
        console.error('Error in adminProjectData:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }

};

exports.userDetail = async (req, res) => {

    const email = req.params.id

    try {

        const client = await connectToCluster();
        const database = client.db("Farm");

        // project
        const projectCollection = database.collection('userFilePath');
        const allProjects = await projectCollection.find({ email: email }).toArray();

        let totalCount = allProjects.length
        let completedCount = 0;
        let failedCount = 0;
        let processCount = 0;

        allProjects.forEach(project => {
            const status = project.status;

            if (status === 'completed') {
                completedCount++;
            } else if (status === 'failed') {
                failedCount++;
            } else if (status === 'process') {
                processCount++;
            }
        });

        // user
        const userCollection = database.collection('Users');
        const users = await userCollection.findOne({ role: 'user', email: email })

        // refund
        const refunCollection = database.collection('Refunds');
        const refunds = await refunCollection.find({ email: email }).toArray();

        let refundAmount = 0;
        refunds.forEach(refund => {
            console.log();
            if (refund.status == 'completed') {
                refundAmount += refund.amound;
            }
        });

        // pricing
        const pricingCollection = database.collection('Pricing');
        const pricing = await pricingCollection.find({ email: email }).toArray();

        // console.log("quotes", quotes);
        res.status(200).json({
            success: true,
            message: 'data fetched successfully',
            data: {
                statusCounts: {
                    totalCount: totalCount,
                    completed: completedCount,
                    failed: failedCount,
                    process: processCount,
                },
                refundedAmount: refundAmount,
                users: users,
                projects: allProjects,
                refunds: refunds,
                pricing: pricing
            }
        });

    } catch (error) {
        console.error('Error in adminProjectData:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }

};

exports.refundStatusUpdate = async (req, res) => {

    const { selectedValue, id, email, amount } = req.body;

    console.log("selected", selectedValue, id, req.url);

    try {
        const client = await connectToCluster();
        const database = client.db("Farm");
        const refunCollection = database.collection('Refunds');
        const userCollection = database.collection('Users');

        const refundResult = await refunCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: selectedValue } }
        );

        if (selectedValue === 'completed') {
            const findUser = await userCollection.findOne({ email: email });

            if (!findUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            const newTotalPrice = (findUser.totalPrice || 0) - amount;

            const userUpdate = await userCollection.updateOne(
                { email: email },
                { $set: { totalPrice: newTotalPrice } }
            );

            if (refundResult.modifiedCount === 1 && userUpdate.modifiedCount === 1) {
                return res.status(200).json({ success: 'Status and user updated successfully' });
            } else {
                return res.status(500).json({ error: 'Refund or user update failed' });
            }
        } else {
            if (refundResult.modifiedCount === 1) {
                return res.status(200).json({ success: 'Refund status updated successfully' });
            } else {
                return res.status(500).json({ error: 'Refund status update failed' });
            }
        }
    } catch (error) {
        console.error('Error in refundStatusUpdate:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

