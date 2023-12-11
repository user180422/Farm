const { connectToCluster } = require('../database/connect');
const stripe = require('stripe')(process.env.STRIPE_SK);

const [
    basic,
    standard,
    premium,
    business
] = [
        'price_1OJdDXSEWeEEkuvGL4sifcUK',
        'price_1OJgMBSEWeEEkuvGQUZrbEsz',
        'price_1OJgMuSEWeEEkuvGufWnboEG',
        'price_1OJgNRSEWeEEkuvGWJIv56jx'
    ]

console.log("basic", basic);

exports.checkoutSession = async (req, res) => {
    const { priceId } = req.body;
    const user = req.user.email;
    console.log("working", priceId);
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId == 1 ? basic : priceId == 2 ? standard : priceId == 3 ? premium : priceId == 4 ? business : '',
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `http://localhost:4000/success.html`,
            cancel_url: 'http://localhost:4000/cancel.html',
        });

        const client = await connectToCluster();
        const database = client.db("Farm");
        const Collection = database.collection('Users');
        const result = await Collection.updateOne(
            { email: user },
            {
                $set: {
                    subscription: {
                        sessionId: session.id
                    }
                }
            }
        );

        console.log("Result", result);

        res.json({ session: session });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.userSession = async (req, res) => {

    console.log("session api");

    const email = req.user.email;
    try {
        const client = await connectToCluster();
        const database = client.db("Farm");
        const Collection = database.collection('Users');
        const userSession = await Collection.findOne({ email: email });

        console.log("usersession", userSession);

        if (!userSession) {
            return res.status(404).json({ error: 'User session not found' });
        }
        res.json({ sessionId: userSession.subscription.sessionId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

exports.paymentSuccess = async (req, res) => {
    const subscriptionId = req.params.id;

    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        console.log("subscription", subscription);

        // const paymentStatus = subscription.latest_invoice.payment_intent.status;

        // res.json({
        //     subscription: subscription,
        //     paymentStatus: paymentStatus,
        // });
    } catch (error) {
        console.error('Error retrieving subscription:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
