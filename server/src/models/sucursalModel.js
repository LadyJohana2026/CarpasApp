const mongoose = require('mongoose');

const sucursalSchema = new mongoose.Schema({
  nombre:    { type: String, required: true, trim: true },
  direccion: { type: String, required: true },
  ciudad:    { type: String, required: true },
  telefono:  { type: String, default: '' },
  email:     { type: String, default: '' },
  horario:   { type: String, default: 'Lun-Vie 9:00-18:00' },
  activa:    { type: Boolean, default: true },
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sucursal', sucursalSchema);
