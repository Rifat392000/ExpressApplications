const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_NAME}.${process.env.DB_CLUSTER_ID}.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const productCollection = client.db('emaJohnDB').collection('products');

    app.get('/products', async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      console.log('pagination query', page, size);
      const result = await productCollection.find()
      .skip(page * size)
      .limit(size)
      .toArray();
      res.send(result);
    })

    app.post('/productByIds', async(req, res) =>{
      const ids = req.body;
      const idsWithObjectId = ids.map(id => new ObjectId(id))
      const query = {
        _id: {
          $in: idsWithObjectId
        }
      }
      const result = await productCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/productsCount', async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    })

  } finally {

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('john is busy shopping')
})

app.listen(port, () => {
  console.log(`ema john server is running on port: ${port}`);
})
