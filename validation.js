//VALIDATION
const Joi = require('joi');

//Register Validation
const registerValidation = data => {
    const schema = {
        username: Joi.string().min(4).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        weight: Joi.number().min(3),
        height: Joi.number().min(3)
    };
    return Joi.validate(data, schema);
};

//Login Validation
const loginValidation = data =>{
    const schema = {
        username: Joi.string().min(4).required(),
        password: Joi.string().min(6).required()
    };
    return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
