const router = require('express').Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const request = require("request");
const querystring = require("querystring");
const schedule = require('node-schedule');
const Token = require("../model/fatsecretToken");


// const fixieRequest = request.defaults({'proxy': process.env.FIXIE_URL});
const fixieRequest = request.defaults({'proxy': process.env.QUOTAGUARDSTATIC_URL});


//FOR MYSQL
// var pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// //FOR THE SERVER
// token = schedule.scheduleJob({hour: 06, minute: 01}, function(){
//     pool.query("SELECT token FROM fatsecret", function(err, result){
//          return setValue(result[0].token);
//     });
// });

// //FOR LOCAL PURPOSE
// pool.query("SELECT token FROM fatsecret", function(err, result){
//     setValue(result[0].token);
// });

// function setValue(value) {
//     token = value;
// }

//FOR THE SERVER
let token = schedule.scheduleJob({hour: 06, minute: 01}, function(){
    Token.findOne({name: "fatsecretToken"}, function(err,res){
        token = res.token;
    })
});

// FOR LOCAL PURPOSE
token = Token.findOne({name: "fatsecretToken"}, function(err,res){
token = res.token;
})

router.get('/foodget/:id',(req,res) => {
    var options = {
        method: 'POST',
        url: `https://platform.fatsecret.com/rest/server.api?${querystring.stringify({  
          method: "food.get",
          food_id: `${parseInt(req.params.id)}`,
          format: "json"
      })}`,
        headers: { 
            'Content-Type': 'application/json',
            'authorization': `Bearer ` + token
        }
     };
    request(options, function (error, response, body) {
        if (error) throw new Error(error); 
        res.send(body);
    });
});

router.get('/foodget1/:id',(req,res) => {
    var options = {
        method: 'POST',
        url: `https://platform.fatsecret.com/rest/server.api?${querystring.stringify({  
          method: "food.get",
          food_id: `${parseInt(req.params.id)}`,
          format: "json"
      })}`,
        headers: { 
            'Content-Type': 'application/json',
            'authorization': `Bearer ` + token
        }
     };
     fixieRequest(options, function (error, response, body) {
        if (error) throw new Error(error); 
        res.send(body);
    });
});

router.get('/foodsearch/:exp',(req,res) => {
    var options = {
        method: 'POST',
        url: `https://platform.fatsecret.com/rest/server.api?${querystring.stringify({  
          method: "foods.search",
          search_expression: `${req.params.exp}`,
          max_results: 1,
          format: "json"
      })}`,
        headers: { 
            'Content-Type': 'application/json',
            'authorization': `Bearer ` + token
        }
     };
    request(options, function (error, response, body) {
        if (error) throw new Error(error); 
        res.send(body);
    });
});
router.get('/foodsearch1/:exp',(req,res) => {
    var options = {
        method: 'POST',
        url: `https://platform.fatsecret.com/rest/server.api?${querystring.stringify({  
          method: "foods.search",
          search_expression: `${req.params.exp}`,
          format: "json"
      })}`,
        headers: { 
            'Content-Type': 'application/json',
            'authorization': `Bearer ` + token
        }
     };
     fixieRequest(options, function (error, response, body) {
        if (error) throw new Error(error); 
        res.send(body);
    });
});

router.get('/search/:exp',(req,res) => {
    var options = {
        method: 'POST',
        url: `https://platform.fatsecret.com/rest/server.api?${querystring.stringify({  
          method: "foods.autocomplete",
          expression: `${req.params.exp}`,
          format: "json"
      })}`,
        headers: { 
            'Content-Type': 'application/json',
            'authorization': `Bearer ` + token
        }
     };
    request(options, function (error, response, body) {
        if (error) throw new Error(error); 
        res.send(body);
    });
});
router.get('/search1/:exp',(req,res) => {
    var options = {
        method: 'POST',
        url: `https://platform.fatsecret.com/rest/server.api?${querystring.stringify({  
          method: "foods.autocomplete",
          expression: `${req.params.exp}`,
          format: "json"
      })}`,
        headers: { 
            'Content-Type': 'application/json',
            'authorization': `Bearer ` + token
        }
     };
     fixieRequest(options, function (error, response, body) {
        if (error) throw new Error(error); 
        res.send(body);
    });
});


module.exports = router;
