const router = require('express').Router();
const request = require("request");
const Token = require("../model/fatsecretToken");
require('dotenv').config();


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
      'scope' : 'premier'
   },
   json: true
};

module.exports = function(req,res,next){
    //den douleuei o elegxos gia to error, enw uparxei to deixnei null
    request(options, function (error, response, body) {
        if (error) throw new Error(error); 
        const token = body.access_token;
        Token.updateOne({name: "fatsecretToken"}, {$set: {token: `${token}`}}, (err,res) => {
            if(err){
                console.log(err)
            }else{
                console.log("Token successfully updated "+token)
            }
        })
        return token;
    });
}


