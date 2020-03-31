const mongoose = require('mongoose');

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
            nutrients:{
                sodium: String,
                calcium: String,
                carbohydrate: String,
                fat: String,
                fiber: String,
                iron: String
            },
            calories: String
        }    
    ],
    calories: String 
});

module.exports = mongoose.model('Meal', mealSchema)

