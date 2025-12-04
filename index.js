const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const greenNestDB = client.db('greenNest');
    const plantsColl = greenNestDB.collection('plants');

    // All Apis Endpoint
    app.get('/plants', async (req, res) => {
      const { category = '', sort = '', order = '' } = req.query;

      const sortOption = {};
      const query = {};

      if (category) {
        query['category'] = category;
      }
      if (sort && order) {
        sortOption[sort] = order === 'asc' ? 1 : -1;
      }

      const cursor = plantsColl.find(query).sort(sortOption);
      const result = await cursor.toArray();
      return res.send(result);
    });

    // await client.db('admin').command({ ping: 1 });
    // console.log(
    //   'Pinged your deployment. You successfully connected to MongoDB!'
    // );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.listen(port, () => {
  console.log(`GreenNest app listening on port ${port}`);
});
