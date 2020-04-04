const router = require('express').Router();
const request = require("request");
const Token = require("../model/fatsecretToken");
require('dotenv').config();

// var pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

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
      'scope' : 'basic'
   },
   json: true
};

module.exports = function(req,res,next){
    request(options, function (error, response, body) {
        current_time = (new Date() / 1000);
        if (error) throw new Error(error); 
        const token = body.access_token;
        Token.updateOne({name: "fatsecretToken"}, {$set: {token: `${token}`, time: `${current_time+86400}`}}, (err,res) => {
            if(err){
                console.log(err)
            }else{
                console.log("Token successfully updated "+token)
            }
        })

        //FOR MYSQL
        // pool.query(`UPDATE fatsecret SET time = ${current_time+86400}, token = '${token}' WHERE id = 1`, function (err){
        //     console.log("Token successfully updated "+token)
        // })

        return token;
    });
}


