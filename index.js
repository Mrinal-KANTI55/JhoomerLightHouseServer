require('dotenv').config()
const { MongoClient } = require('mongodb');
const express = require('express')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;


const app = express()
const port = process.env.PORT || 4000;

app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.8iwul.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db("Light-house");
    const userCollection = database.collection("User");
    const productCollection = database.collection("product");
     //   get all offers 
     app.get('/product', async (req, res) => {
      const offer = productCollection.find({});
      const result = await offer.toArray();
      res.json(result);
    });
    //   insert offer 
    app.post('/product', async (req, res) => {
      const data = req.body;
      const result = await productCollection.insertOne(data);
      console.log(`product was insert : ${result.insertedId}`);
      res.send(result);
    });
    //insert user name and mail
    app.post('/user', async (req, res) => {
      const userInfo = req.body;
      const result = await userCollection.insertOne(userInfo);
      res.json(result);
    })
    app.put('/user/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const update = {
        $set: { role: 'admin' }
      }
      const result = await userCollection.updateOne(filter, update);
      res.json(result);
    })
    // delete product by admin 
    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;
      const data = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(data);
      res.json(result);
    });


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Light House server : ${port}`)
})