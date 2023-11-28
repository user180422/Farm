const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("Middleware ");
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ isAuthenticated: false });
    }

    const token = authHeader.split(' ')[1];
    console.log("token", token);

    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        console.log("user", err, user);
        if (err) {
            return res.status(403).json({ isAuthenticated: false });
        }

        req.user = user;
        next();
    });
};
