const express = require('express'),
    fatsecretRoute = require('./routes/fatsecret'),
    authRoute = require('./routes/auth'),
    postRoute = require('./routes/posts');
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require("request");
const querystring = require("querystring");
const schedule = require('node-schedule');

// const fixieRequest = request.defaults({'proxy': process.env.FIXIE_URL});
const fixieRequest = request.defaults({'proxy': process.env.QUOTAGUARDSTATIC_URL});

//this is necessary to create the connection with the database
const dotenv = require('dotenv');
dotenv.config();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//this is needed to make auth-token accessible in front
const corsOptions = {
    exposedHeaders: 'auth-token',
  };
app.use(cors(corsOptions));

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
// app.use('/api/tokenTest', fatsecretRoute);


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
        'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1MjZBMkFCNkQ0MkQ5REIwMjBEMThBRDMxRTE5MTdCMUUzMjg2RTUiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJSU2FpcTIxQzJkc0NEUml0TWVHUmV4NHlodVUifQ.eyJuYmYiOjE1ODI1MDMyMjQsImV4cCI6MTU4MjU4OTYyNCwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiI3MzBhYWU0ZjYzYTc0ZjkxYTE3NGFiZThlNTQ3NDE2OSIsInNjb3BlIjpbImJhc2ljIl19.Rv--F8XCV8Wo7_99cUccQnWFlmU1TE2g3rXwGnWfsaRBv7Ream33huT4A2JypDUpH49nahe0ulcZzp3Ij8Q8tTwPeGXKRpjmW7XsEsuAr5arEuYH_rAMw61gHgVTBjbe9XNVHlIG0xKjLR5xKGeIOX6_qzR-wUqYVwH1M4O3ukq--kVuIAt1Rvib7E3EOJfIHhVTikOpftwwfEtg_DjcH0VY27gS9re27yqXRU5rtweWska9B8bCzGJWrCHHU-m6Bqw4Q3e_bND4YEHZb7whzi6wJpZi0o8KTsFBSZwwK2XEDFAMrOX_O0p6F2CFfq1IMJikm4g5CwOPvZjmczGeVw'
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
 
// REFRESH TOKEN EVERYDAY AT 6:00 AM
var j = schedule.scheduleJob({hour: 06, minute: 00}, function(){
    fatsecretRoute()
});