const Producto = require('../models/productoModel');

// GET /api/productos
const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true });
    res.json({ ok: true, total: productos.length, data: productos });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener productos', error: error.message });
  }
};

// GET /api/productos/:id
const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }
    res.json({ ok: true, data: producto });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener el producto', error: error.message });
  }
};

// POST /api/productos
const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, descripcion, imagen, categoria, stock } = req.body;
    const producto = new Producto({ nombre, precio, descripcion, imagen, categoria, stock });
    await producto.save();
    res.status(201).json({ ok: true, message: 'Producto creado correctamente', data: producto });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al crear el producto', error: error.message });
  }
};

// PUT /api/productos/:id
const actualizarProducto = async (req, res) => {
  try {
    const { nombre, precio, descripcion, imagen, categoria, stock } = req.body;
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre, precio, descripcion, imagen, categoria, stock },
      { new: true, runValidators: true }
    );
    if (!producto) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }
    res.json({ ok: true, message: 'Producto actualizado correctamente', data: producto });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al actualizar el producto', error: error.message });
  }
};

// DELETE /api/productos/:id
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!producto) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }
    res.json({ ok: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al eliminar el producto', error: error.message });
  }
};

module.exports = { listarProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto };
