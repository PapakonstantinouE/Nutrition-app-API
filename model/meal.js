const mongoose = require('mongoose');
// const moment = require('moment-timezone');

// const dateGreece = moment.tz(Date.now(), "Europe/Athens");
// var test = new Date().toLocaleString("en-US", {timeZone: "Europe/Athens"})
// console.log(test);
// var utcDate = moment.utc().toDate();

const mealSchema = new mongoose.Schema({
    mealkind: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    ingredients:[
        {
            food_id: String,
            food_name: String,
            serving: String,
            quantity: Number,
            nutrients:{
                sodium: String,
                calcium: String,
                carbohydrate: String,
                fat: String,
                fiber: String,
                iron: String,
                protein: String,
                cholesterol: String,
                potassium: String,
                sugar: String,
                vitamin_a: String,
                vitamin_c: String
            },
            calories: String
        }    
    ],
    calories: String 
});

module.exports = mongoose.model('Meal', mealSchema)

