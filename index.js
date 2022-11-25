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
const ProductBookingCollection = client.db('Interverse').collection('bookings');

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
    const quary = { _id: ObjectId(id) }
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
app.get('/usephoneServices', async (req, res) => {
    const catagory = req.query.catagory;
    const quary = { catogory: catagory }
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

//add used phone to database
app.post('/addusedproduct', async (req, res) => {
    const phoneDetail = req.body;
    try {
        const result = await ProductCatagoryServiceCollection.insertOne(phoneDetail)
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

app.post('/bookings', async (req, res) => {
    const bookingsDetails = req.body;
    try {
        const result = await ProductBookingCollection.insertOne(bookingsDetails)
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

app.get('/mybooking', async (req, res) => {
    const email = req.query.email;

    const quary = { buyerEmail: email }
    try {
        const result = await ProductBookingCollection.find(quary).toArray()
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
app.get('/myproducts', async (req, res) => {
    const email = req.query.email;

    const quary = { sellerEmail: email }
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
app.put('/usephoneServices/update/:id', async (req, res) => {
    const { id } = req.params;
    const filter = { _id: ObjectId(id) }
    const updateDoc = {
        $set: {
            available: req.body.available
        }
    }
    try {
        const result = await ProductCatagoryServiceCollection.updateOne(filter, updateDoc)
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
//for ad :
app.put('/usephoneServices/publish/:id', async (req, res) => {
    const { id } = req.params;
    const filter = { _id: ObjectId(id) }

    const updateDoc = {
        $set: {
            type: req.body.type
        }
    }
    try {
        const result = await ProductCatagoryServiceCollection.updateOne(filter, updateDoc)
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
//get ad :
app.get('/advertises', async (req, res) => {
    const available = req.query.available;
    const type = req.query.type;
    const quary = { available: available, type: type }
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

app.listen(port, () => console.log(port, "- port is open"))