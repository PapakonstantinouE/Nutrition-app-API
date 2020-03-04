const router = require('express').Router();
const mysql = require('mysql');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const request = require("request");
const {registerValidation,loginValidation} = require('../validation');

var pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


router.post('/register', (req,res) => {
    // VALIDATE THE DATA BEFORE MAKE A USER
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try{
        var height = req.body.height;
        var weight = req.body.weight;
        var age = req.body.age;
        var gender = req.body.gender;

        // var checkValues = [ req.body.email, req.body.username]
        var checkValues = [req.body.username]
        var tempValues  = [ req.body.email, req.body.username, req.body.password, req.body.weight, req.body.height, req.body.age, req.body.gender]

        // pool.query(`SELECT * FROM users WHERE email=? or username=?`, checkValues, function(err,result1){
        pool.query(`SELECT * FROM users WHERE username=?`, checkValues, function(err,result1){
            if (!isEmptyObject(result1)) return res.status(400).send("Username or email already exist, try another one"); 
            else{
                //First find bmr
                var options = {
                    method: 'GET',
                    url: `https://urvipaithankar.herokuapp.com/bmr/index.php/${height}/${weight}/${age}/${gender} 
                })}`
                };
                request(options, function (error, response, body) {
                    if (error) throw new Error(error); 
                    else{
                        //and when you find it, then create the user with all the details
                        var bmr = 1500
                        pool.query(`INSERT INTO users (email,username,password,weight,height,age,gender,bmr) VALUES (?,?,?,?,?,?,?,${bmr})`, tempValues, function(err,result){
                            if (!err) {
                                res.send('User has successfully created');
                            }else{
                                // res.send('Something went wrong');
                                // to check what shit 'something' goes wrong 
                                res.send(err.message);
                            }
                        })
                    }
                });
            }
        })
    }catch(err){
        res.status(400).send(err);
    }
});



router.post('/login', (req,res) => {
    // VALIDATE THE DATA BEFORE MAKE A USER
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    var tempValues = [req.body.username, req.body.password]
    try {
        pool.query(`SELECT * FROM users WHERE username=? and password=?`, tempValues, function(err,result){
            if (isEmptyObject(result)) return res.send('Username or password is wrong. Please try again.');

            //CREATE AND ASSIGN A TOKEN
            const token = jwt.sign({username: result[0].username},process.env.TOKEN_SECRET);
            res.header('auth-token', token).send('Logged in!');
        })        
    }catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;

//Function to check if json file is empty
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
};