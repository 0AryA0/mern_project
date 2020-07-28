const Validator = require('validator');
const isEmpty = require('./is_empty');


module.exports = function validateRegister(data) {
    let errors = {};
    
    if(!Validator.isLength(data.name, { min: 2, max: 15})) {
        errors.name = 'name must be between 2 and 15 characters';
    }


    return {
        errors,
        isValid: isEmpty(errors)
    };
};
