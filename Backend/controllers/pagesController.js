exports.loginCheck = (req, res) => {
    console.log("home api", req.user);

    if (req.user) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
};


