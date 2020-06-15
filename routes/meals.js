const router = require('express').Router();
const mongoose = require('mongoose');
const Meals = require ('../model/meal');
const verify = require('./verifyToken');


router.post('/getDailyMeals', verify, (req,res,next) => {
    console.log(req.body)
    var user = req.user._id;
    Meals.find({user_id: user, date: {$gte: "2020-05-24T21:00:00.000+00:00", $lt: "2020-05-25T21:00:00.000+00:00"}})
    //{$gte: "2020-05-18T21:00:00.000+00:00", $lt: "2020-05-19T21:00:00.000+00:00"}
    .then((meals) => {
        
        for(i=0;i<meals.length;i++){
            var counter = 0;
            var ingNum = meals[i].ingredients.length;
            for(j=0; j<ingNum; j++){
                console.log(meals[i].ingredients[j].nutrients.sodium);
                var sodium = meals[i].ingredients[j].nutrients.sodium;
                counter += sodium;
                console.log(counter);
            }
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(meals);
    }, (err) => next(err))
    .catch((err) => next(err));
})

router.put('/addMeal', verify, (req,res,next) => {
    var userReq = req.user._id
    var mealReq = req.body.mealkind;
    var dateReq = req.body.date;

    //pairnw thn imeromhnia apo to json, thn spaw kai ftiaxnw 2 imeromhnies 
    //thn arxh kai to telos ths hmeras pou thelw na psa3w gia geumata
    var b = dateReq.split(/\D+/);
    var startDate = new Date(Date.UTC(b[0], --b[1], b[2]));
    var endDate =  new Date(Date.UTC(b[0], b[1], ++b[2]));


    Meals.findOne({user_id: userReq, mealkind: mealReq, date: {$gte: startDate, $lt: endDate}})
    .then((meal) => {
        //an uparxei hdh eggrafh gia auto to geuma apla to enhmerwnei
        if (meal != null) {
            meal.ingredients.push(req.body.ingredients[0]);
            meal.calories += Number(req.body.ingredients[0].calories) 
            meal.save()
            .then((meal) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(meal);                
            }, (err) => next(err));
        }
        else {
            //alliws to dimioyrgei
            Meals.create(req.body)
            .then((meal) => {
                console.log('Meal Created ', meal);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(meal);
            }, (err) => next(err))
            .catch((err) => next(err));
        }    
    }, (err) => next(err))
    .catch((err) => next(err));
})

router.get('/getMeal/:date', verify, (req,res,next) => {

    var userReq = req.user._id
    var dateReq = req.params.date;

    //pairnw thn imeromhnia apo to json, thn spaw kai ftiaxnw 2 imeromhnies 
    //thn arxh kai to telos ths hmeras pou thelw na psa3w gia geumata
    var b = dateReq.split(/\D+/);
    var startDate = new Date(Date.UTC(b[0], --b[1], b[2]));
    var endDate =  new Date(Date.UTC(b[0], b[1], ++b[2]));

    Meals.find({user_id: userReq, date: {$gte: startDate, $lt: endDate}})
    .then((meals) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(meals);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.delete('/deleteMeal/:date/:meal/:food_id', verify, (req,res,next) => {
    var userReq = req.user._id;
    var mealReq = req.params.meal;
    var dateReq = req.params.date;
    var food_id = req.params.food_id;


    var b = dateReq.split(/\D+/);
    var startDate = new Date(Date.UTC(b[0], --b[1], b[2]));
    var endDate =  new Date(Date.UTC(b[0], b[1], ++b[2]));

    Meals.findOne({user_id: userReq, mealkind: mealReq, date: {$gte: startDate, $lt: endDate}})
    .then((meal) => 
        //den douleuei, xtupaei sto meal.ingredients.fatSecret_id
        {if (meal != null && meal.ingredients.fatSecret_id(food_id) != null) {
            meal.ingredients.fatSecret_id(food_id).remove();
            meal.save()
            .then((meal) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(meal);                
            }, (err) => next(err));
        }
        else if (meal == null) {
            err = new Error('Meal ' + mealReq + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Food ' +food_id + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));


});

module.exports = router;