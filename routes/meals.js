const router = require('express').Router();
const mongoose = require('mongoose');
const Meals = require ('../model/meal');
const verify = require('./verifyToken');



router.get('/getDailyStats', verify, (req,res,next) => {
    console.log(req.body)
    var user = req.user._id;
    Meals.find({user_id: user, date: {$gte: "2020-05-24T21:00:00.000+00:00", $lt: "2020-05-25T21:00:00.000+00:00"}})
    //{$gte: "2020-05-18T21:00:00.000+00:00", $lt: "2020-05-19T21:00:00.000+00:00"}
    .then((meals) => {
        var totalPr = 0;
        var totalCalcium = 0;
        var totalChol = 0;
        var totalCarbo = 0;
        var totalIron = 0;
        var totalFat = 0;
        
        
        for(i=0;i<meals.length;i++){
            
            
            var ingNum = meals[i].ingredients.length;
            for(j=0; j<ingNum; j++){
                var iron = Number(meals[i].ingredients[j].nutrients.iron);
                totalIron += iron;
                var protein = Number(meals[i].ingredients[j].nutrients.protein);
                totalPr += protein;
                var calcium = Number(meals[i].ingredients[j].nutrients.calcium);
                totalCalcium += calcium;
                var chole = Number(meals[i].ingredients[j].nutrients.cholesterol);
                totalChol += chole;
                var carbo = Number(meals[i].ingredients[j].nutrients.carbohydrate);
                totalCarbo += carbo;
                var fat = Number(meals[i].ingredients[j].nutrients.fat);
                totalFat += fat;
                
                
                
            }
            
        }
        
        //console.log(`Total Sodium ${totalSod} `);
        console.log(`Total protein ${totalPr} `);
        
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send([totalPr, totalCalcium, totalChol,totalCarbo,totalIron,totalFat])
        //res.json(data);
    }, (err) => next(err))
    .catch((err) => next(err));
})

router.get('/getDailyStatsSP', verify, (req,res,next) => {
    console.log(req.body)
    var user = req.user._id;
    Meals.find({user_id: user, date: {$gte: "2020-05-24T21:00:00.000+00:00", $lt: "2020-05-25T21:00:00.000+00:00"}})
    //{$gte: "2020-05-18T21:00:00.000+00:00", $lt: "2020-05-19T21:00:00.000+00:00"}
    .then((meals) => {
        var totalSodium = 0;
        var totalPotas = 0;     
        for(i=0;i<meals.length;i++){
            
            var ingNum = meals[i].ingredients.length;
            for(j=0; j<ingNum; j++){
                var sodium = Number(meals[i].ingredients[j].nutrients.sodium);
                totalSodium += sodium;
                var potassium = Number(meals[i].ingredients[j].nutrients.potassium);
                totalPotas += potassium;  
            }
            
        }
        
        console.log(`Total potassium ${totalPotas} `);
        
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send([totalSodium, totalPotas])
        //res.json(data);
    }, (err) => next(err))
    .catch((err) => next(err));
})

router.get('/getDailyCalories/:date', verify, (req,res,next) => {
    console.log(req.body)
    var user = req.user._id;
    var dateReq = req.params.date;

    //pairnw thn imeromhnia apo to json, thn spaw kai ftiaxnw 2 imeromhnies 
    //thn arxh kai to telos ths hmeras pou thelw na psa3w gia geumata
    var b = dateReq.split(/\D+/);
    var startDate = new Date(Date.UTC(b[0], --b[1], b[2]));
    var endDate =  new Date(Date.UTC(b[0], b[1], ++b[2]));

    Meals.find({user_id: user, date: {$gte: startDate, $lt: endDate}})
  
    .then((meals) => {
        var totalCal =0;
        for(i=0;i<meals.length;i++){
            var cal = meals[i].calories;
            totalCal += cal;            
        }
        
        console.log(`Total Calories ${totalCal} `);
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send([totalCal]);
        
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

    Meals.updateOne( {user_id: userReq, mealkind: mealReq, date: {$gte: startDate, $lt: endDate}},
        {$pull:{ingredients:{fatSecret_id: food_id}}},
        { new: true })
    .then(() => {
        Meals.findOne({user_id: userReq, mealkind: mealReq, date: {$gte: startDate, $lt: endDate}})
        .then((meal) => {
            var totalCal =0;
            for(i=0;i<meal.ingredients.length;i++){
                var cal = Number(meal.ingredients[i].calories);
                totalCal += cal;            
            }
            meal.calories = totalCal;
            meal.save()
            .then((meal) => {
                console.log(totalCal)
                console.log(meal)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(meal);                
            }, (err) => next(err));
        }, (err) => next(err))
        .catch((err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));

});

router.get('/getMealsNutri/:date', verify, (req,res,next) => {
    console.log(req.body)
    var user = req.user._id;
    var dateReq = req.params.date;


    var b = dateReq.split(/\D+/);
    var startDate = new Date(Date.UTC(b[0], --b[1], b[2]));
    var endDate =  new Date(Date.UTC(b[0], b[1], ++b[2]));

    Meals.find({user_id: user, date: {$gte: startDate, $lt: endDate}})
    .then((meals) => {
        var nutrients=[];

        for(i=0;i<meals.length;i++){
            var Protein = 0;
            var Fiber = 0;
            var Carbohydrate = 0;
            var Fat = 0;
            var Energy = 0;
            for(j=0; j<meals[i].ingredients.length; j++){
                Protein += Number(meals[i].ingredients[j].nutrients.protein);
                Fiber += Number(meals[i].ingredients[j].nutrients.calcium);
                Carbohydrate += Number(meals[i].ingredients[j].nutrients.carbohydrate);
                Fat +=  Number(meals[i].ingredients[j].nutrients.fat);
            }
            Energy = meals[i].calories;
            switch (meals[i].mealkind){
                case 'breakfast':
                    var brNutrients = {mealkind: "brNutrients", nutrients: {Energy, Fat,Carbohydrate,Protein,Fiber}}
                    nutrients.push(brNutrients)
                break;
                case 'lunch':
                    var lnNutrients = {mealkind: "lnNutrients", nutrients: {Energy, Fat,Carbohydrate,Protein,Fiber}}
                    nutrients.push(lnNutrients)
                break;
                case 'dinner':
                    var dnNutrients = {mealkind: "dnNutrients", nutrients: {Energy, Fat,Carbohydrate,Protein,Fiber}}
                    nutrients.push(dnNutrients)
                break;
                case 'snack':
                    var snNutrients = {mealkind: "snNutrients", nutrients: {Energy, Fat,Carbohydrate,Protein,Fiber}}
                    nutrients.push(snNutrients)
                break;
                
            }


        }
        console.log(nutrients)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(nutrients)
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = router;