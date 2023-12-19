// Packages

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { connectToCluster } = require("./database/connect");
const loginCheck = require('./middleware/loginCheck')
const path = require("path")
const stripe = require('stripe')(process.env.STRIPE_SK);

// Imports
const userRoutes = require('./routes/userRoutes')
const pageRoutes = require('./routes/pagesRouter')
const quoteRoutes = require('./routes/quoteRouter')
const pricingRoute = require('./routes/pricingRouter')
const renderRoute = require('./routes/renderRoute')
const dashboardRoute = require('./routes/dashboardRouter')

// App Middlewares

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '1gb', limit: '1gb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.raw({ type: 'application/zip', limit: '10mb' }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.get('/dashboard.html', loginCheck.dashboardCheck, (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'dashboard.html'));
});

app.get('/refund.html', loginCheck.authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'refund.html'));
});

// Routes

app.use('/api', userRoutes)
app.use('/api', pageRoutes)
app.use('/api', quoteRoutes)
app.use('/api', pricingRoute)
app.use('/api', renderRoute)
app.use('/api', dashboardRoute)

// Server and databse

const PORT = process.env.PORT || 3000;
async function start () {
    const mongoClient = await connectToCluster();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

start();

