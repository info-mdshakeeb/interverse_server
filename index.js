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


app.listen(port, () => console.log(port, "- port is open"))