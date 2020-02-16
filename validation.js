//VALIDATION

const Joi = require('@hapi/joi');

//Register Validation
const registerValidation = (data) =>{
    const schema = {
        username: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        weight: Joi.string().min(6).required(),
        height: Joi.string().min(6).required()
    };
    return Joi.ValidationError(data, schema);
};

//Login Validation
const loginValidation = data =>{
    const schema = {
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required()
    };
    return Joi.ValidationError(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
