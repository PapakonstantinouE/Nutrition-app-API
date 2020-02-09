const express = require('express'),
    fatsecret = require('./routes/fatsecret');
var cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
var request = require("request");

//this is necessary to create the connection with the database
const dotenv = require('dotenv');
dotenv.config();

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


var pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.get('/hello', (req, res) => res.send('Hello World!'))

app.get('/api',(req,res) => {
    res.send('API is up & working.');
});

var port = process.env.PORT || 8080;
app.listen(port,() => console.log(`Listening on port ${port}`)); 

// NECESSARY TO VALIDATE FATSECRET TOKEN
//the request is big so i transfered it in fatsecret.js and i call it from there
// app.get('/api/tokenTest', fatsecret.getToken);

//NECESSARY TO VALIDATE FATSECRET TOKEN
clientID = process.env.CLIENT_ID,
clientSecret = process.env.CLIENT_SECRET

var options = {
   method: 'POST',
   url: 'https://oauth.fatsecret.com/connect/token',
   method : 'POST',
   auth : {
      user : clientID,
      password : clientSecret
   },
   headers: { 'content-type': 'application/json'},
   form: {
      'grant_type': 'client_credentials',
      'scope' : 'basic'
   },
   json: true
};
app.get('/api/tokenTest', (req, res) =>{
    try {
        var current_time = (new Date() / 1000);
        pool.query("SELECT * FROM fatsecret", function (err, result) {
            const data_time = result[0].time;
            if(current_time<data_time){
                //do nothing
                res.send("Token is working fine")
            }else{
                request(options, function (error, response, body) {
                    if (error) throw new Error(error); 
                    const token = body.access_token;
                    pool.query(`UPDATE fatsecret SET time = ${current_time}, token = '${token}' WHERE id = 1`, function (err){
                        res.send("Token successfully updated")
                    })
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
})