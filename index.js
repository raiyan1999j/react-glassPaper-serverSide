require('dotenv').config();
const express = require('express');
const app = express();
const cors= require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.sqywi72.mongodb.net/?retryWrites=true&w=majority`;
const port=  5000;

// const corsConfig = {
//   origin: ['http://localhost:5173','https://client-side-react.web.app','http://localhost:4173/'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json());

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const database = client.db("paperCraft");
    const userData = database.collection("userData");

    // get all data
    app.get('/getItems',async(req,res)=>{
      const collectData = userData.find();
      const result = await collectData.toArray();

      res.send(result);
    })

    // get specific data for details page
    app.get('/getDetails/:id',async (req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(`${id}`)};

      const result = await userData.findOne(query);

      res.send(result)
    })
    // get sub-category data
    app.get('/subCategoryPage/:category',async(req,res)=>{
      const item = req.params.category;
      const query= {subItem:`${item}`};

      const collectData = userData.find(query);
      const result = await collectData.toArray();

      res.send(result);
    })
    // user based data
    app.get('/myItem/:name',async(req,res)=>{
      const name = req.params.name;
      const query= {owner:`${name}`};

      const collectData = userData.find(query);
      const result = await collectData.toArray();

      res.send(result);
    })

    // get data for update
    app.get('/getSpecific/:id',async (req,res)=>{
      const userId = req.params.id;
      const query = {_id: new ObjectId(`${userId}`)};

      const result = await userData.findOne(query);

      res.send(result);
    })
    // post data from add items page
    app.post('/addItem',async (req,res)=>{
        const info = req.body;
        const result= await userData.insertOne(info);

        res.send(result);
    })
    // update user data
    app.put('/updateInfo/:id',async (req,res)=>{
      const userId = req.params.id;
      const updateData = req.body;

      const query = {_id: new ObjectId(`${userId}`)};
      const option= {upsert: true};
      
      const updateDoc ={
        $set:{
          item: updateData.item,
          subItem: updateData.subItemInfo,
          description: updateData.description,
          price: updateData.price,
          rating: updateData.rating,
          custom: updateData.customization,
          email: updateData.email,
          name: updateData.name,
          stock: updateData.stockInfo,
          imgURL: updateData.imgURL,
          owner: updateData.owner
        }
      }

      const result = await userData.updateOne(query,updateDoc,option)

      res.send(result)
    })

    // remove item from user

    app.delete('/removeItem/:id',async(req,res)=>{
      const userId = req.params.id;
      const query = {_id: new ObjectId(`${userId}`)};

      const result= await userData.deleteOne(query);

      console.log(result);
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
