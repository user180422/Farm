const { connectToCluster } = require('../database/connect');

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

        let totalPricesSum = 0;
        users.forEach(user => {
            if (user.totalPrice) {
                totalPricesSum += user.totalPrice;
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
            message: 'Projects fetched successfully',
            data: {
                statusCounts: {
                    totalCount: totalCount,
                    completed: completedCount,
                    failed: failedCount,
                    process: processCount,
                },
                totalAmount: totalPricesSum,
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


