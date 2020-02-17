const express = require('express'),
    fatsecretRoute = require('./routes/fatsecret'),
    authRoute = require('./routes/auth'),
    postRoute = require('./routes/posts');
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require("request");
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

app.get('/api',(req,res) => {
    res.send('API is up & working.');
});

var port = process.env.PORT || 8080;
app.listen(port,() => console.log(`Listening on port ${port}`)); 

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

// NECESSARY TO VALIDATE FATSECRET TOKEN
//the request is big so i transfered it in fatsecret.js and i call it from there
app.use('/api/tokenTest', fatsecretRoute);


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

 
