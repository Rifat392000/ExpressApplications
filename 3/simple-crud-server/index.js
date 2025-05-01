const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());



// const uri = "mongodb://localhost:27017";

const username = "rifat392000";
const password = "tAbRKsmxe3EetCM4";
const clusterName = "project-cluster-1";
const clusterId = "6cwyhb5";
const appName = "project-cluster-1";

const uri = `mongodb+srv://${username}:${password}@${clusterName}.${clusterId}.mongodb.net/?retryWrites=true&w=majority&appName=${appName}`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const DB_NAME = 'usersdb';
const COLLECTION_NAME = 'users';


async function run() {
    try{
        await client.connect();

        const usersCollection = client.db(DB_NAME).collection(COLLECTION_NAME);

        app.get('/users', async(req, res) =>{
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/users/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await usersCollection.findOne(query);
            res.send(result);
        })

        app.post('/users', async(req, res) =>{
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        })

        app.put('/users/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id : new ObjectId(id)}
            const user = req.body;

            const updatedDoc = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            console.log(user);
            
            const result = await usersCollection.updateOne(filter, updatedDoc, options);

            res.send(result);
        })

        app.delete('/users/:id', async(req, res) =>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })

        await client.db('admin').command({ping: 1})
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{

    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('.........Simple Crud Server running.........')
});

app.listen(port, () => {
    console.log(`Simple CRUD server running on, ${port}`)
})

// try{

// }
// catch {
    
// }
// finally{
    
// }