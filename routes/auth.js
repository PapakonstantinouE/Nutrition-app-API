const router = require('express').Router();
const User = require ('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require("request");
const {registerValidation,loginValidation} = require('../validation');
const verify = require('./verifyToken');


router.post('/validateSignup', async (req,res) => {
    // VALIDATE THE DATA BEFORE MAKE A USER
    const {error} = registerValidation(req.body);
    if (error) return res.send(error.details[0].message);

    //CHECKING IF EMAIL ALREADY EXISTS
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) return res.send("Email already exists");

    //CHECKING IF USERNAME ALREADY EXISTS
    const usernameExist = await User.findOne({username: req.body.username})
    if (usernameExist) return res.send("This username is already used, please try another one.");

    res.send("It's ok");
})



router.post('/register', async (req, res) => {
    
    // VALIDATE THE DATA BEFORE MAKE A USER
    const {error} = registerValidation(req.body);
    if (error) return res.send(error.details[0].message);

    //CHECKING IF USER ALREADY EXISTS
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) return res.send("Email already exists");

    //CHECKING IF USERNAME ALREADY EXISTS
    const usernameExist = await User.findOne({username: req.body.username})
    if (usernameExist) return res.send("This username is already used, please try another one.");
 
    //HASH PASSWORDS
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const height = req.body.height;
    const weight = req.body.weight;
    const age = req.body.age;
    const gender = req.body.gender;
    
    //CREATE A NEW USER
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        height: height,
        weight: weight,
        age: age,
        gender: gender
    });
    try{
        const savedUser = await user.save();
        res.send('User has successfully created');
    } catch(err){
        res.send(err.message);
    }

    //Find BMI
    var bmiAPI = {
        method: 'GET',
        url: `https://urvipaithankar.herokuapp.com/bmi/index.php/${height}/${weight}/${age}/${gender} 
    })}`
    };
    request(bmiAPI, function (error, response, body) {
        if (error)
            throw new Error(error);
        else {
            var body1 = body.slice(7);
            var body2 = JSON.parse(body1);
            var bmi = body2['bmi'];
            User.updateOne({ _id: user._id }, { $set: { bmi: `${bmi}` } }, () => {});
        }
    })
    //Find BMR
    var bmrAPI = {
        method: 'GET',
        url: `https://urvipaithankar.herokuapp.com/bmr/index.php/${height}/${weight}/${age}/${gender} 
    })}`
    };
    request(bmrAPI, function (error, response, body) {
        if (error)
            throw new Error(error);
        else {
            var body1 = body.slice(7);
            var body2 = JSON.parse(body1);
            var bmr = body2['bmr'];
            User.updateOne({ _id: user._id }, { $set: { bmr: `${bmr}` } }, () => {});
        }
    })
});



router.post('/login', async (req, res) => {
    
    // VALIDATE THE DATA BEFORE MAKE A USER
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //CHECKING IF USER ALREADY EXISTS
    const user = await User.findOne({username: req.body.username})
    if (!user) return res.status(400).send("Username doesn't exists");
 
    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Invalid password");

    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET , { expiresIn: '24h' });
    res.header('auth-token', token).send('Logged in!');

    
});

router.get('/getUser', verify , (req,res) => {
    const token = req.header('Authorization');
    var decoded = jwt.decode(token, {complete: true});
    res.send(decoded.payload._id)
});

module.exports = router;
