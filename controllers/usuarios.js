
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado:true }

    // const usuarios = await Usuario.find( query )
    // .skip(Number( desde ) )// con el skip, podemos indicar en que posicion inicializar la consulta
    // .limit(Number(limite));//Mediante limit, permite cargar la informacion de los usuarios deseados

    // const total = await Usuario.countDocuments( query );

    //Con el promise all, me permite enviar un arreglo de promesas, y con el await espera la resolucion de todas las promesa.
    const [total, usuarios] = await Promise.all([//se desestructura el ARREGLO, pasando total y usuarios, quien nos importa para la respuesta
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip(Number( desde ) )
            .limit(Number(limite))
    ]);

    res.json({
     total,
     usuarios
    });
}
const usuariosPost = async (req, res) => {

 

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });




    //Encriptar la contraseña, Salt se utiliza para el numero de vueltas que se le da  a la contraseña para hacerla mas seguro, por defectop 10 es una buena opción
    const salt = bcryptjs.genSaltSync();
    // Hash es para encriptarlo en una sola vía
    usuario.password = bcryptjs.hashSync( password, salt );


    // Guardar en la bsae de datos

    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async (req, res) => {

    const { id } = req.params;
    const { _id, password, google, correo, ... resto } = req.body;

    //Validar contra base de datos

    if ( password ){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json({
        usuario
    });
}


const usuariosPatch = async (req, res) => {
    res.json({
        msg:'patch API - controlador',
    });
}


const usuariosDelete = async (req, res = response ) => {

    const{ id } =  req.params;
    //Físicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );
    const usuario = await Usuario.findByIdAndUpdate( id, { estado:false } );
    res.json( usuario );
}



module.exports = {

    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,

}