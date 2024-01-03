const { connectToCluster } = require('../database/connect');

exports.loginCheck = (req, res) => {
    console.log("home api", req.user);

    if (req.user) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
};

exports.adminCheck = async (req, res) => {

    console.log("admin check");

    try {
        const email = req.user.email;
        const client = await connectToCluster();
        const database = client.db("Farm");
        const Collection = database.collection('Users');
        const findUser = await Collection.findOne({ email: email });

        if (findUser.role == "admin") {
            return res.json({ isAuthenticated: true });
        } else {
            return res.json({ isAuthenticated: false });
        }
    } catch (error) {
        return res.json({ isAuthenticated: false });
    }

}

