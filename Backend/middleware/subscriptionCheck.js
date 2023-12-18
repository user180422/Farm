const { connectToCluster } = require('../database/connect');

exports.subscriptionCheck = async (req, res, next) => {

    try {
        const user = req.user.email;

        if (!user) {
            // User or subscription information is missing
            return res.status(403).json({ error: 'User not found' });
        }

        const client = await connectToCluster();
        const database = client.db("Farm");
        const Collection = database.collection('Users');
        const userSession = await Collection.findOne({ email: user });

        // const date = userSession.subscription.endDate

        console.log("userSession Middle", userSession);
        if (userSession &&
            userSession.subscription &&
            userSession.subscription.paymentStatus == "paid") {

            req.subscriptionStatus = "active";
            next()
        } else {
            req.subscriptionStatus = "expired";
            next()
        }



    } catch (error) {
        console.error('Error checking subscription status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
