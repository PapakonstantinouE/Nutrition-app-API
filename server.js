const express = require('express'),
    updateToken = require('./routes/tokenUpdate'),
    authRoute = require('./routes/auth'),
    postRoute = require('./routes/posts'),
    fatsecretRoute = require('./routes/fatsecret'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    request = require("request"),
    schedule = require('node-schedule');

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
app.use('/api/food', fatsecretRoute)
 
//THIS IS NEEDED TO KEEP HEROKU-API AWAKE
var ping = {
    method: 'GET',
    url: `https://nutrition-app-api.herokuapp.com/api`
 };
 var g = schedule.scheduleJob("*/15 * * * *", function(){
    request(ping, function (error, response, body) {
        console.log(body)
    });
}); 

// REFRESH TOKEN EVERYDAY AT 6:00 AM
var j = schedule.scheduleJob({hour: 06, minute: 00}, function(){
    updateToken()
});
app.get('/api/chart', (req,res) => {
    res.send({  
        protein: '20',
        sodium: '5'  
    })
})