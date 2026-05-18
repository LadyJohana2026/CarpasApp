const Carrito = require('../models/carritoModel');

// POST /api/carrito
const guardarCarrito = async (req, res) => {
  try {
    const { items, total } = req.body;

    // Mostrar en consola del servidor
    console.log('\n════════════════════════════════════');
    console.log('🛒  NUEVO PEDIDO RECIBIDO');
    console.log('════════════════════════════════════');
    console.log('Fecha:', new Date().toLocaleString('es-AR'));
    items.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.nombre} × ${item.cantidad} — $${item.precio}`);
    });
    console.log(`  TOTAL: $${total}`);
    console.log('════════════════════════════════════\n');

    const pedido = new Carrito({ items, total });
    await pedido.save();

    res.status(201).json({
      ok: true,
      message: '¡Pedido recibido! Nos contactaremos pronto.',
      pedidoId: pedido._id
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al procesar el carrito', error: error.message });
  }
};

// GET /api/carrito
const listarPedidos = async (req, res) => {
  try {
    const pedidos = await Carrito.find().sort({ fechaPedido: -1 });
    res.json({ ok: true, total: pedidos.length, data: pedidos });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener pedidos', error: error.message });
  }
};

// GET /api/carrito/:id
const obtenerPedido = async (req, res) => {
  try {
    const pedido = await Carrito.findById(req.params.id);
    if (!pedido) return res.status(404).json({ ok: false, message: 'Pedido no encontrado' });
    res.json({ ok: true, data: pedido });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener el pedido', error: error.message });
  }
};

module.exports = { guardarCarrito, listarPedidos, obtenerPedido };
