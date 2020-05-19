const router = require('express').Router();
const Meals = require ('../model/meal');
const verify = require('./verifyToken');

router.post('/addMeal', verify, (req,res,next) => {
    Meals.create(req.body)
    .then((meal) => {
        console.log('Meal Created ', meal);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(meal);
    }, (err) => next(err))
    .catch((err) => next(err));
})

router.post('/getDailyMeals', verify, (req,res,next) => {
    console.log(req.body)
    var user = req.user._id;
    Meals.find({user_id: user, date: {$gte: "2020-05-18T21:00:00.000+00:00", $lt: "2020-05-19T21:00:00.000+00:00"}})
    //{$gte: "2020-05-18T21:00:00.000+00:00", $lt: "2020-05-19T21:00:00.000+00:00"}
    .then((meals) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(meals);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = router;