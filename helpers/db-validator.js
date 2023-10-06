
const Role = require('../models/role');
const Usuario = require('../models/usuario')

const esRoleValido = async ( rol = '') => {
    const existeRol = await Role.findOne( {rol });
    //para lanzar error personalizado con el express-validator, a continuación
    if(!existeRol){
            throw new Error(`El rol ${rol}, no esta registrado en la base de datos.`);
    }
}

const emailExiste = async ( correo = '' ) =>{
        //Verificar si el correo existe
        const existeEmail = await Usuario.findOne({ correo });
        if( existeEmail ){
            //status 400 indica error, en este caso duplicidad de correo
            throw new Error( `El correo: ${correo}, ya esta registrado` );
        }
}
const existeUsuarioPorId = async ( id ) =>{
    //Verificar si el correo existe
    const existeUsuario = await Usuario.findById( id );
    if( !existeUsuario ){
        //status 400 indica error, en este caso duplicidad de correo
        throw new Error( `El ID no existe: ${id}` );
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
}