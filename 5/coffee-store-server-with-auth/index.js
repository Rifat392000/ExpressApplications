const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_NAME}.${process.env.DB_CLUSTER_ID}.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`;

// Create MongoClient
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Main function to run the server
async function run() {
    try {
        // Connect to MongoDB
        await client.connect();

        // Define collections
        const coffeesCollection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME_1);
        const usersCollection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME_2);

        // ===== Coffee Routes =====

        // Get all coffees
        app.get('/coffees', async (req, res) => {
            const result = await coffeesCollection.find().toArray();
            res.send(result);
        });

        // Get a single coffee by ID
        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeesCollection.findOne(query);
            res.send(result);
        });

        // Add a new coffee
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeesCollection.insertOne(newCoffee);
            res.send(result);
        });

        // Update a coffee by ID
        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const updatedDoc = {
                $set: updatedCoffee
            };
            const result = await coffeesCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        // Delete a coffee by ID
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeesCollection.deleteOne(query);
            res.send(result);
        });

        // ===== User Routes =====

        // Get all users
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });

        // Add a new user
        app.post('/users', async (req, res) => {
            const userProfile = req.body;
            console.log(userProfile);
            const result = await usersCollection.insertOne(userProfile);
            res.send(result);
        });

        // Update user's last sign-in time
        app.patch('/users', async (req, res) => {
            const { email, lastSignInTime } = req.body;
            const filter = { email: email };
            const updatedDoc = {
                $set: {
                    lastSignInTime: lastSignInTime
                }
            };
            const result = await usersCollection.updateOne(filter, updatedDoc);
            res.send(result);
        });

        // Delete a user by ID
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        });

        // Confirm successful MongoDB connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Do not close the connection to keep server alive
        // await client.close();
    }
}

// Run server
run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
    res.send('Coffee server is getting hotter.');
});

// Start server
app.listen(port, () => {
    console.log(`Coffee server is running on port ${port}`);
});
