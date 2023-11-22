const { MongoClient } = require("mongodb")

async function connectToCluster(uri) {
    
    let mongoClient;
    try {
        mongoClient = new MongoClient(process.env.MONGODB_URI);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');

        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
    
}

module.exports = {
    connectToCluster
}