const express = require('express'),
    fatsecret = require('./routes/fatsecret');
var cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
var request = require("request");
const querystring = require("querystring");

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
    res.send(token);
});

var port = process.env.PORT || 8080;
app.listen(port,() => console.log(`Listening on port ${port}`)); 

// NECESSARY TO VALIDATE FATSECRET TOKEN
//the request is big so i transfered it in fatsecret.js and i call it from there
app.get('/api/tokenTest', fatsecret.getToken);

//endpoint for login
app.post('/api/login', (req,res) =>{
    var body = req.body;
    var tempValues = [body.username, body.password]
    try {
        pool.query(`SELECT * FROM users WHERE username=? and password=?`, tempValues, function(err,result){
            if (isEmptyObject(result)) return res.send('Username or password is wrong. Please try again.');
            res.send(result);
        })
    }catch(err){
        res.send("Oops, something went wrong. I'll let our back-end team know! ERROR CODE: 10");
    }
})

//endpoint to signup
app.post('/api/signup', (req,res) =>{
    var body = req.body;
    var tempValues = [body.username, body.password, body.email, body.weight, body.height]
    try {
        pool.query(`INSERT INTO users (username,password,email,weight,height) VALUES (?,?,?,?,?)`, tempValues, function(err,result){
            if (!err) {
                res.send('User has successfully created');
            }else{
                res.send('Something went wrong');
            }
        })
    }catch(err){
        res.send("Oops, something went wrong. I'll let our back-end team know! ERROR CODE: 10");
    }
})

//Function to check if json file is empty
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
};



var options = {
    method: 'POST',
    url: `https://platform.fatsecret.com/rest/server.api?${querystring.stringify({  
      method: "food.get",
      food_id: '35752',
      format: "json"
  })}`,
    // params: {  
    //     method: "foods.search",
    //     // food_id: '35752'
    //     search_expression: "avo",
    //     format: "json",
    //     page_number: "0",
    //     max_results: "20"
    // },
    headers: { 
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
    }
 };

app.get('/api/foodget',(req,res) => {
    request(options, function (error, response, body) {
        if (error) throw new Error(error); 
        res.send(body);
    });
});

app.get('/api/getIP',(req,res) => {
    request('https://api.ipify.org?format=json',(error,response,body) => {
        res.send(body);
    })
})

 

 
