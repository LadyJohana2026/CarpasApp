const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    minlength: [5, 'La descripción debe tener al menos 5 caracteres']
  },
  imagen: {
    type: String,
    required: [true, 'La URL de imagen es obligatoria']
  },
  categoria: {
    type: String,
    enum: {
      values: ['carpas', 'parasoles', 'accesorios', 'otros'],
      message: 'Categoría inválida. Valores permitidos: carpas, parasoles, accesorios, otros'
    },
    default: 'otros'
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'El stock no puede ser negativo']
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Producto', productoSchema);
