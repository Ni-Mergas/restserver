const { Router } = require("express");
const { check } = require("express-validator");

// const { validarCampos } = require("../middlewares/validar-campos");
// const { ValidarJWT } = require("../middlewares/validar-jwt");
// const { esAdminRole, tieneRole } = require("../middlewares/validar-roles");
const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole
} = require('../middlewares/index');

const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validator");

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
} = require("../controllers/usuarios");

const router = Router();

router.get("/", usuariosGet);

router.put(
  "/:id",
  check("id", "No es ID válido").isMongoId(),
  check("id").custom(existeUsuarioPorId),
  check("rol").custom(esRoleValido),
  validarCampos,
  usuariosPut
);

router.post(
  "/",
  //con el check preparo los errores que se van cometiendo, en este caso validando el correo sea óptimo
  check("nombre", "El nombre es obligatorio").not().isEmpty(),
  check("password", "El password es obligatorio, mínimo 6 caracteres").isLength(
    { min: 6 }
  ),
  check("correo", "El correo no es válido").isEmail(),
  check("correo").custom(emailExiste),
  // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
  check("rol").custom(esRoleValido),
  validarCampos,
  usuariosPost
);

router.delete(
  "/:id",
  validarJWT, //Con la función next, permite validar en orden, por esa razon el token debe ir de primero.
  // esAdminRole, //Este middleware, obliga a que si o si el usuario sea administrador.
  tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
  check("id", "No es ID válido").isMongoId(),
  check("id").custom(existeUsuarioPorId),
  validarCampos,
  usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;
