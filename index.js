require('dotenv').config();
const express = require('express');
const app = express();
const cors= require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.sqywi72.mongodb.net/?retryWrites=true&w=majority`;
const port= process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const database = client.db("paperCraft");
    const userData = database.collection("userData");

    app.get('/getItems',async(req,res)=>{
      const collectData = userData.find();
      const result = await collectData.toArray();

      res.send(result);
    })

    app.post('/addItem',async (req,res)=>{
        const info = req.body;
        const result= await userData.insertOne(info);

        res.send(result);
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log('working or not')
})
