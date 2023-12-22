const express = require("express")
const app = express()
require ('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fcmyfrv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    const database = client.db("taskDB")
    const taskCollection = database.collection("tasks")
  try {
     app.post('/task' , async(req , res) => {
        const task = req.body
        const result = await taskCollection.insertOne(task)
        res.send(result)
     })
     app.get('/tasks/:email' , async(req , res) => {
        const email = req.params.email
        const query = {email : email}
        console.log(email)
        
        const result = await taskCollection.find(query).toArray()
        res.send(result)
     })
     app.get('/task/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = { _id: new ObjectId(id) };
    
        try {
            const result = await taskCollection.findOne(query);
            res.send(result);
        } catch (error) {
            console.error('Error fetching task:', error);
            res.status(500).send('Internal Server Error');
        }
    });
     app.delete('/task/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = { _id: new ObjectId(id) };
    
        try {
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        } catch (error) {
            console.error('Error fetching task:', error);
            res.status(500).send('Internal Server Error');
        }
    });
     app.patch('/outGoing/:id' , async(req , res) => {
        const id = req.params.id
       
        const filter = {_id : new ObjectId(id)}
        const options = { upsert: true };
        const updatedTask = {
          $set:{
           result : "outgoing"
            
          }
        }
        const result = await taskCollection.updateOne(filter , updatedTask , options)
        res.send(result)
  
      })
     app.patch('/completed/:id' , async(req , res) => {
        const id = req.params.id
       
        const filter = {_id : new ObjectId(id)}
        const options = { upsert: true };
        const updatedTask = {
          $set:{
           result : "completed"
            
          }
        }
        const result = await taskCollection.updateOne(filter , updatedTask , options)
        res.send(result)
  
      })
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);


app.get('/',(req , res) => {
    res.send("website running properly")
})
app.listen(port , ()=>{
   console.log(`The server is running on port ${port}`)
})
