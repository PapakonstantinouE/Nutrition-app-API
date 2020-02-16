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

exports.login = function (req,res){
    var body = req.body;
    var tempValues = [body.username, body.password]
    try {
        pool.query(`SELECT * FROM users WHERE username=? and password=?`, tempValues, function(err,result){
            if (isEmptyObject(result)) return res.send('Username or password is wrong. Please try again.');
            res.send(result);
        })
    }catch(err){
        res.send("Oops, something went wrong. I'll let our back-end team know! ERROR CODE: 10");
    }
}

exports.signup = function (req,res){
    var body = req.body;
    var tempValues = [body.username, body.password, body.email, body.weight, body.height]
    try {
        pool.query(`INSERT INTO users (username,password,email,weight,height) VALUES (?,?,?,?,?)`, tempValues, function(err,result){
            if (!err) {
                res.send('User has successfully created');
            }else{
                res.send('Something went wrong');
            }
        })
    }catch(err){
        res.send("Oops, something went wrong. I'll let our back-end team know! ERROR CODE: 10");
    }
}

//Function to check if json file is empty
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
};