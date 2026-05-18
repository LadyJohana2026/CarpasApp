const { Router } = require('express');
const router = Router();

const { listarProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productoController');
const { reglasProducto, reglasId } = require('../middlewares/validacionesProducto');
const validar = require('../middlewares/validar');

// GET  /api/productos
router.get('/', listarProductos);

// GET  /api/productos/:id
router.get('/:id', reglasId, validar, obtenerProducto);

// POST /api/productos
router.post('/', reglasProducto, validar, crearProducto);

// PUT  /api/productos/:id
router.put('/:id', [...reglasId, ...reglasProducto], validar, actualizarProducto);

// DELETE /api/productos/:id
router.delete('/:id', reglasId, validar, eliminarProducto);

module.exports = router;
