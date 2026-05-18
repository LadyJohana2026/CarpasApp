const Sucursal = require('../models/sucursalModel');

const listarSucursales = async (req, res) => {
  try {
    const sucursales = await Sucursal.find({ activa: true });
    res.json({ ok: true, total: sucursales.length, data: sucursales });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener sucursales', error: error.message });
  }
};

const obtenerSucursal = async (req, res) => {
  try {
    const sucursal = await Sucursal.findById(req.params.id);
    if (!sucursal) return res.status(404).json({ ok: false, message: 'Sucursal no encontrada' });
    res.json({ ok: true, data: sucursal });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener la sucursal', error: error.message });
  }
};

const crearSucursal = async (req, res) => {
  try {
    const sucursal = new Sucursal(req.body);
    await sucursal.save();
    res.status(201).json({ ok: true, message: 'Sucursal creada correctamente', data: sucursal });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al crear la sucursal', error: error.message });
  }
};

const actualizarSucursal = async (req, res) => {
  try {
    const sucursal = await Sucursal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sucursal) return res.status(404).json({ ok: false, message: 'Sucursal no encontrada' });
    res.json({ ok: true, message: 'Sucursal actualizada correctamente', data: sucursal });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al actualizar la sucursal', error: error.message });
  }
};

const eliminarSucursal = async (req, res) => {
  try {
    const sucursal = await Sucursal.findByIdAndUpdate(req.params.id, { activa: false }, { new: true });
    if (!sucursal) return res.status(404).json({ ok: false, message: 'Sucursal no encontrada' });
    res.json({ ok: true, message: 'Sucursal eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al eliminar la sucursal', error: error.message });
  }
};

module.exports = { listarSucursales, obtenerSucursal, crearSucursal, actualizarSucursal, eliminarSucursal };
