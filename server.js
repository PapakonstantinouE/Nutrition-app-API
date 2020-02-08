const express = require('express');
var cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


var con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

con.connect(function(err){
    if(err) throw err;
    console.log("Connected to DB");
});

app.get('/hello', (req, res) => res.send('Hello World!'))

app.get('/',(req,res) => {
    res.send('*ROOT ENDPOINT* API is up & working.');
});

app.get('/api',(req,res) => {
    res.send('API is up & working.');
});

var port = process.env.PORT || 8080;
app.listen(port,() => console.log(`Listening on port ${port}`)); 

