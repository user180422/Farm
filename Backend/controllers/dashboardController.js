exports.dashboardData = (req, res) => {
    const user = req.user;
    console.log("dashboard api", user);

    // res.json({ user });
};