const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xkmwi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


console.log(uri);

async function run (){
    try{
        await client.connect();
        const database = client.db('sozib');
        const sectorsCollection = database.collection('sectors');
        const addCollection = database.collection('addDocuments');


        // // Get API
        app.get('/sectors', async(req, res) =>{
            const cursor = sectorsCollection.find({});
            const sectors = await cursor.toArray();
            res.send(sectors);
        })


        // // Save Documents
        app.get('/addDocuments', async(req, res) =>{
            const cursor = addCollection.find({});
            const sectors = await cursor.toArray();
            res.send(sectors);
        })

        // post api
        app.post('/addDocuments', async(req, res) =>{
            const addpost = req.body;
            console.log('hit the post api', addpost);

            const result = await addCollection.insertOne(addpost);
            console.log(result);

            res.json(result)
        })


        // Delete API
        app.delete('/addDocuments/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await addCollection.deleteOne(query)
            res.json(result);
        });
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('sozib server is running');
});

app.listen(port, () =>{
    console.log('server running at port', port);
});