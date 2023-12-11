const jwt = require('jsonwebtoken');

exports.userVerify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("sec middle", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.user = user;
        next();
    });
};

