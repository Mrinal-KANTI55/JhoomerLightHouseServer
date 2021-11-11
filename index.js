require('dotenv').config()
const { MongoClient } = require('mongodb');
const express = require('express')
const cors = require('cors')

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
    //insert user name and mail
    app.post('/user', async (req, res) => {
      const userInfo = req.body;
      const result = await userCollection.insertOne(userInfo);
      res.json(result);
    })


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