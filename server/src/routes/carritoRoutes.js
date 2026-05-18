const { Router } = require('express');
const router = Router();

const { guardarCarrito, listarPedidos, obtenerPedido } = require('../controllers/carritoController');
const { reglasCarrito } = require('../middlewares/validacionesCarrito');
const { reglasId } = require('../middlewares/validacionesProducto');
const validar = require('../middlewares/validar');

// POST /api/carrito  — recibe el pedido desde el frontend
router.post('/', reglasCarrito, validar, guardarCarrito);

// GET  /api/carrito  — lista todos los pedidos (panel admin)
router.get('/', listarPedidos);

// GET  /api/carrito/:id
router.get('/:id', reglasId, validar, obtenerPedido);

module.exports = router;
