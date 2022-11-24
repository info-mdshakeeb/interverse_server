const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require("cors");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const app = express();
const port = process.env.PORT

//middelware :
app.use(cors());
app.use(express.json());

//chack :
app.get('/text', (req, res) => res.send('node is open'))

//database connect :
const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster-skv.zmdghy4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});
const mongodb = () => {
    try {
        client.connect()
        console.log('database connected');
    } catch (error) {
        console.log(error.name, error.message)
    }
}
mongodb()

//all Collentions :
const UserCollention = client.db('Interverse').collection('users');
const ProductCatagorysCollection = client.db('Interverse').collection('productcatagorys');
const ProductCatagoryServiceCollection = client.db('Interverse').collection('productcatagoryservice');

app.post('/users', async (req, res) => {
    const user = req.body;
    // console.log(user);
    try {
        const result = await UserCollention.insertOne(user)
        res.send({
            success: true,
            data: result
        })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({
            success: false,
            message: error.message
        })
    }
})
app.post('/productcatagorys', async (req, res) => {
    const productcatagorys = req.body;
    // console.log(user);
    try {
        const result = await ProductCatagorysCollection.insertOne(productcatagorys)
        res.send({
            success: true,
            data: result
        })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({
            success: false,
            message: error.message
        })
    }
})
app.get('/productcatagorys', async (req, res) => {
    const quary = {}
    try {
        const result = await ProductCatagorysCollection.find(quary).toArray()
        res.send({
            success: true,
            data: result
        })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({
            success: false,
            message: error.message
        })
    }
})
app.get('/productcatagory/:id', async (req, res) => {
    const { id } = req.params
    const quary = { id: id }
    try {
        const result = await ProductCatagoryServiceCollection.find(quary).toArray()
        res.send({
            success: true,
            data: result
        })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({
            success: false,
            message: error.message
        })
    }
})


// ProductCatagorys


app.listen(port, () => console.log(port, "- port is open"))