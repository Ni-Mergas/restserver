const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require ('../models/usuario');
//Next para que continue validando 
const validarJWT = async (req = request, res = response, next) =>{

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg:'No hay token en la petición'
        });
    }
    
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );
        if( !usuario ){
            return res.status(401).json({
                msg:'token no válido - usuario no existe en DB'
            })
        }
        //verificar si el usuario tiene estado true
        if(!usuario.estado){
            return res.status(401).json({
                msg:'token no válido - usuario con esatdo: false'
            })
        }

        req.usuario = usuario;
        next(); //Se llama la función next para que continue, con la validación
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'token no válido'
        });
    }

} 

module.exports = {
    validarJWT
}