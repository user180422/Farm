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

// Imports
const userRoutes = require('./routes/userRoutes')
const pageRoutes = require('./routes/pagesRouter')

// App Middlewares

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.get('/dashboard.html', loginCheck.dashboardCheck, (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'dashboard.html'));
});

// Routes

app.use('/api', userRoutes)
app.use('/api', pageRoutes)

// Server and databse

const PORT = process.env.PORT || 3000;
async function start () {
    const mongoClient = await connectToCluster();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

start();

