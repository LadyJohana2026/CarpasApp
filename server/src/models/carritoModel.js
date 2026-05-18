const mongoose = require('mongoose');

const itemCarritoSchema = new mongoose.Schema({
  productoId: { type: String, required: true },
  nombre:     { type: String, required: true },
  precio:     { type: Number, required: true, min: 0 },
  cantidad:   { type: Number, required: true, min: 1 },
  imagen:     { type: String, default: '' }
}, { _id: false });

const carritoSchema = new mongoose.Schema({
  items: {
    type: [itemCarritoSchema],
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'El carrito debe tener al menos un producto'
    }
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'El total no puede ser negativo']
  },
  estado: {
    type: String,
    enum: ['pendiente', 'procesando', 'completado', 'cancelado'],
    default: 'pendiente'
  },
  fechaPedido: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Carrito', carritoSchema);
