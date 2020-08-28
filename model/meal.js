const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    mealkind: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date
    },
    ingredients:[
        {
            fatSecret_id: String,
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
    calories: Number 
});

module.exports = mongoose.model('Meal', mealSchema)

