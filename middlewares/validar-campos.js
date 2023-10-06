

const { validationResult } = require('express-validator');

// Mi primer middleware
// como es un middleware, se le adiciona un tercer argumento llamado next, y se invoca al final next()
const validarCampos = ( req, res, next) =>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    next();

}

module.exports = {

    validarCampos,
}