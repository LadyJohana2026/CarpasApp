// Estado del carrito — almacenado en localStorage
import { carritoService } from '../services/api.js';

const KEY = 'carritoElFuerte';

function cargarDesdeStorage() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function guardarEnStorage(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export const carrito = {
  items: cargarDesdeStorage(),

  agregar(producto) {
    const existente = this.items.find(i => i.productoId === producto._id);
    if (existente) {
      existente.cantidad++;
    } else {
      this.items.push({
        productoId: producto._id,
        nombre:     producto.nombre,
        precio:     producto.precio,
        imagen:     producto.imagen,
        cantidad:   1
      });
    }
    guardarEnStorage(this.items);
  },

  quitar(productoId) {
    this.items = this.items.filter(i => i.productoId !== productoId);
    guardarEnStorage(this.items);
  },

  vaciar() {
    this.items = [];
    guardarEnStorage(this.items);
  },

  total() {
    return this.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  },

  cantidadTotal() {
    return this.items.reduce((acc, i) => acc + i.cantidad, 0);
  },

  async confirmarPedido() {
    if (this.items.length === 0) throw new Error('El carrito está vacío');
    const respuesta = await carritoService.enviarPedido({
      items: this.items,
      total: this.total()
    });
    this.vaciar();
    return respuesta;
  }
};
