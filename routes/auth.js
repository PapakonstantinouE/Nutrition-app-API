const router = require('express').Router();
const mysql = require('mysql');
require('dotenv').config();
const {registerValidation,loginValidation} = require('../validation');

var pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});



router.post('/register',(req,res) => {

    //VALIDATE THE DATA BEFORE MAKE A USER
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    var tempValues = [req.body.username, req.body.password, req.body.email, req.body.weight, req.body.height]
    try {
        pool.query(`INSERT INTO users (username,password,email,weight,height) VALUES (?,?,?,?,?)`, tempValues, function(err,result){
            if (!err) {
                res.send('User has successfully created');
            }else{
                res.send('Something went wrong');
            }
        })
    }catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;

//Function to check if json file is empty
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
};