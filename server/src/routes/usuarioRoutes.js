const { Router } = require('express');
const router = Router();

const { registrar, login, listarUsuarios } = require('../controllers/usuarioController');
const { reglasRegistro, reglasLogin } = require('../middlewares/validacionesUsuario');
const validar = require('../middlewares/validar');

router.post('/registro', reglasRegistro, validar, registrar);
router.post('/login',    reglasLogin,    validar, login);
router.get('/',          listarUsuarios);

module.exports = router;
