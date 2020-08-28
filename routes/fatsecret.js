const router = require('express').Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const request = require("request");
const querystring = require("querystring");
const schedule = require('node-schedule');
const Token = require("../model/fatsecretToken");



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
    request(options, async function  (error, response, body) {
        if (error) throw new Error(error);
        else{
            var json1 = await JSON.parse(body)
            var food = await json1.foods.food.food_id
            //console.log(body);
            getfood(food, (result) => {
                res.send(result)
            });
        }   
    });
});

router.get('/autocomplete/:exp',(req,res) => {
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



module.exports = router;
