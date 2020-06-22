const express = require('express'),
    updateToken = require('./routes/tokenUpdate'),
    authRoute = require('./routes/auth'),
    postRoute = require('./routes/posts'),
    fatsecretRoute = require('./routes/fatsecret'),
    mealsRoute = require('./routes/meals'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    request = require("request"),
    schedule = require('node-schedule'),
    mongoose = require('mongoose');

//this is necessary to create the connection with the database
const dotenv = require('dotenv');
dotenv.config();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err,res) => {
    if(err){
        console.log(err.message)
    }else{
        console.log("Connected to mongoDB!")
    }
})

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
app.use('/api/food', fatsecretRoute);
app.use('/api/meals', mealsRoute);


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


app.get('/updateToken', (req,res) => {updateToken();res.end("Token updated and is printed on console")})