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
        // Create a checkout session with proper line_items
        const session = await stripe.checkout.sessions.create({
            cancel_url: 'http://localhost:4000/cancel.html',
            line_items: [
                {
                    price: 'price_1ONckGSEWeEEkuvGnYLET11a',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:4000/success.html',
        });

        console.log("session", session);

        const client = await connectToCluster();
        const database = client.db("Farm");
        const Collection = database.collection('Users');
        const findPrice = await Collection.findOne({ email: user });

        // Ensure that findPrice and subscription exist before accessing nested properties
        if (findPrice && findPrice.subscription) {
            const existingPrice = findPrice.subscription.totalPrice;

            // Update the user's subscription details
            const result = await Collection.updateOne(
                { email: user },
                {
                    $set: {
                        subscription: {
                            sessionId: session.id,
                            totalPrice: existingPrice,
                            paymentStatus: session.payment_status,
                        }
                    }
                }
            );

            console.log("Result", result);

            res.json({ session: session });
        } else {
            res.status(400).json({ error: 'User subscription not found' });
        }
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
    const sessionId = req.body.id;
    const user = req.user.email;
    console.log("session", sessionId);

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log("session", session);

        if (session.payment_status === 'paid') {

            const client = await connectToCluster();
            const database = client.db("Farm");
            const Collection = database.collection('Users');
            const findPrice = await Collection.findOne({ email: user });

            if (findPrice && findPrice.subscription) {
                const result = await Collection.updateOne(
                    { email: user },
                    {
                        $set: {
                            sessionId: session.id,
                            totalPrice: session.payment_status,
                        },
                        $inc: {
                            paymentStatus: session.amount_total / 100,
                        },
                    }
                );

                res.json({
                    sessionId: session.id,
                    totalPrice: session.amount_total,
                    paymentStatus: session.payment_status,
                });
            } else {
                res.status(400).json({ error: 'User subscription not found' });
            }

        } else {
            res.status(400).json({ error: 'Payment not successful' });
        }
    } catch (error) {
        console.error('Error retrieving session or subscription:', error.message);

        if (error.statusCode === 404) {
            res.status(404).json({ error: 'Session not found' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};