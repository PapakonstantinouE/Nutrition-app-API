const express = require('express'),
    fatsecret = require('./routes/fatsecret');
var cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
var request = require("request");
const querystring = require("querystring");

// const fixieRequest = request.defaults({'proxy': process.env.FIXIE_URL});
const fixieRequest = request.defaults({'proxy': process.env.QUOTAGUARDSTATIC_URL});

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
        'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1MjZBMkFCNkQ0MkQ5REIwMjBEMThBRDMxRTE5MTdCMUUzMjg2RTUiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJSU2FpcTIxQzJkc0NEUml0TWVHUmV4NHlodVUifQ.eyJuYmYiOjE1ODE3ODcyMTIsImV4cCI6MTU4MTg3MzYxMiwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiI3MzBhYWU0ZjYzYTc0ZjkxYTE3NGFiZThlNTQ3NDE2OSIsInNjb3BlIjpbImJhc2ljIl19.L0ZRYM-Rkl7Jg0q_dsxne1Hc4wnbMZurtJ6QNaCRIoGD2MWtGjCAIsDexUXoST0JbnYKeul2hwhl81Rni3H6T9rdLxw8pGKypmo-b2YBMWxW_NmZ34pZn60xLGVfSCQJ51m0SZg6RRr71tAGhHj9kmgCZjX4NKs9fzAtDBdNgYQAByLuUqNom17f_nzK5zAGrcay8JZTqFxN7rnFhTNQqXG55vi65ER5oK_fGH03r8oOkVbm2rjCO4Dc0KPkJM7P6vML5JsdDUFi9DGASdzyFgTJ-wOambJeCrg6iPG27n4QqwdcqHb_SW9-sYgkCLrvzHJHEp987-I8L2rw-mBfig'
    }
 };

app.get('/api/foodget',(req,res) => {
    request(options, function (error, response, body) {
        if (error) throw new Error(error); 
        res.send(body);
    });
});

app.get('/api/foodget1',(req,res) => {
    fixieRequest(options, function (error, response, body) {
        if (error) throw new Error(error); 
        res.send(body);
    });
});

 
