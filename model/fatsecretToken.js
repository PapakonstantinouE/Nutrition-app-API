const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
    name: String,
    token:{
        type: String,
        require: true
    },
    time: String
})

module.exports = mongoose.model('Token', tokenSchema)