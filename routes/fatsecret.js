const router = require('express').Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const request = require("request");
const querystring = require("querystring");
const schedule = require('node-schedule');
const Token = require("../model/fatsecretToken");


// const fixieRequest = request.defaults({'proxy': process.env.FIXIE_URL});
const fixieRequest = request.defaults({'proxy': process.env.QUOTAGUARDSTATIC_URL});


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

function getfood(food, callback) {
    var options = {
        method: 'POST',
        url: `https://platform.fatsecret.com/rest/server.api?${querystring.stringify({  
          method: "food.get",
          food_id: `${food}`,
          format: "json"
      })}`,
        headers: { 
            'Content-Type': 'application/json',
            'authorization': `Bearer ` + token
        }
     };
    request(options, function (error, response, body) {
        if (error) throw new Error(error); 
        callback (body);
    });
}
router.get('/foodsearchTest/:exp',(req,res) => {
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
        else{
        var json1 = JSON.parse(body)
        var food = JSON.parse(body).foods.food.food_id
        //console.log(json1.foods.food.food_id);
        }
        getfood(food, (result) => {
            res.send(result)
        });
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
