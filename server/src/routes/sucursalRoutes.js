const { Router } = require('express');
const router = Router();

const { listarSucursales, obtenerSucursal, crearSucursal, actualizarSucursal, eliminarSucursal } = require('../controllers/sucursalController');
const { reglasSucursal, reglasId } = require('../middlewares/validacionesSucursal');
const validar = require('../middlewares/validar');

router.get('/',      listarSucursales);
router.get('/:id',   reglasId, validar, obtenerSucursal);
router.post('/',     reglasSucursal, validar, crearSucursal);
router.put('/:id',   [...reglasId, ...reglasSucursal], validar, actualizarSucursal);
router.delete('/:id', reglasId, validar, eliminarSucursal);

module.exports = router;
