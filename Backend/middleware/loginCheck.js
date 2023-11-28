const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ isAuthenticated: false });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ isAuthenticated: false });
        }

        req.user = user;
        next();
    });
};

exports.dashboardCheck = (req, res, next) => {
    const authHeader = req.headers.authorization;
console.log(
    "dashboard middle"
);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.redirect('/login');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) {
            return res.redirect('/login');
        }

        req.user = user;
        next();
    });
};
