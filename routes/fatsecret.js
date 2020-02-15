const mysql = require('mysql');
var request = require("request");
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

var pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

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
global.token= "";
exports.getToken = function(req, res){
try {
    
    current_time = (new Date() / 1000);
    pool.query("SELECT * FROM fatsecret", function (err, result) {
        const data_time = result[0].time;
        if(current_time<data_time){
            //do nothing
            token = result[0].token;
            res.send("Token is working fine")
        }else{
            request(options, function (error, response, body) {
                if (error) throw new Error(error); 
                const token = body.access_token;
                pool.query(`UPDATE fatsecret SET time = ${current_time+86400}, token = '${token}' WHERE id = 1`, function (err){
                    token = result[0].token;
                    res.send("Token successfully updated")
                })
            });
        }
    });
} catch (err) {
    console.log(err);
}}
