const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
    name: String,
    token:{
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Token', tokenSchema)