const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const verifytoken = require('./verifytoken');
require('dotenv').config();
const app = express();
const port = process.env.PORT
const stripe = require("stripe")(process.env.STRIPE_KEY);

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
const ProductReportCollection = client.db('Interverse').collection('reported-data');
//verify admin seller for add product :
async function verifyAdminSeller(req, res, next) {
    const email = req.user?.email;
    const query = { email: email }
    // console.log(email);
    try {
        const user = await UserCollention.findOne(query)
        // console.log(user);
        if (user?.role === 'admin') {
            return next()
        } else if (user?.role == 'seller') {
            return next()
        }
        else {
            res.send({
                success: false,
                data: 'Unauthenticated'
            })
        }
    } catch (error) {
        console.log(error.name, "--", error.message)
    }
}
app.get('/user/admin/:email', async (req, res) => {
    const { email } = req.params
    const query = { email: email }
    try {
        const user = await UserCollention.findOne(query)

        res.send({ isAdmin: user?.role === 'admin' })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({
            success: false,
            message: error.message
        })
    }
})
app.get('/user/seller/:email', async (req, res) => {
    const { email } = req.params
    const query = { email: email }
    try {
        const user = await UserCollention.findOne(query)
        res.send({ isSeller: user?.role === 'seller' })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({
            success: false,
            message: error.message
        })
    }
})
app.put('/users/:email', async (req, res) => {
    const { email } = req.params;
    const user = req.body;
    const filter = { email: email }
    const options = { upsert: true }
    const updateDoc = {
        $set: user
    }
    // console.log(user);
    try {
        const result = await UserCollention.updateOne(filter, updateDoc, options)
        const token = jwt.sign(user, process.env.ACCSEE_SECRET_TOKEN, {
            expiresIn: '7d'
        })
        res.send({
            success: true,
            data: { result, token }
        })
    } catch (error) {
        console.log(error.name, error.message)
        res.send({
            success: false,
            message: error.message
        })
    }
})
app.get('/admin/users', async (req, res) => {
    const { role } = req.query
    // console.log(role);
    const quary = { role }
    try {
        const users = await UserCollention.find(quary).toArray()
        res.send({
            success: true,
            data: users
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
app.post('/addusedproduct', verifytoken, verifyAdminSeller, async (req, res) => {
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
        console.log(result);
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
app.put('/user/admin/vf/:id', async (req, res) => {
    const { id } = req.params;
    const filter = { _id: ObjectId(id) }
    const options = { upsert: true }
    const updateDoc = {
        $set: {
            type: req.body.type
        }
    }
    try {
        const result = await UserCollention.updateOne(filter, updateDoc, options)
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
app.delete('/user/admin/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserCollention.deleteOne({ _id: ObjectId(id) });
        res.send(
            {
                succerss: true,
            }
        )
    } catch (error) {
        console.log(error.name, error.message);
        res.send(
            {
                succerss: false,
                message: "Delate item faild"
            }
        )
    }
})

app.get('/admin/:email', async (req, res) => {
    const { email } = req.params;
    const quary = { email }
    try {
        const result = await UserCollention.find(quary).toArray()
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
//report :
app.post('/user/admin/report', async (req, res) => {
    const ReportData = req.body;
    try {
        const result = await ProductReportCollection.insertOne(ReportData)
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

app.get('/reports', async (req, res) => {
    try {
        const result = await ProductReportCollection.find({}).toArray()
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
//payment :

app.post("/create-payment-intent", async (req, res) => {
    const booking = req.body;
    const price = booking.price
    const amount = price * 100;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            currency: "usd",
            amount,
            'payment_method_types': [
                'card'
            ]
        });
        res.send({
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.log(error.name, error.message)
        res.send({
            success: false,
            message: error.message
        })
    }
})

app.put('/user/payment/:id', async (req, res) => {
    const { id } = req.params;
    const filter = { _id: ObjectId(id) }
    const updateDoc = {
        $set: {
            available: req.body.available
        }
    }
    try {
        const result = await ProductBookingCollection.updateOne(filter, updateDoc)
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