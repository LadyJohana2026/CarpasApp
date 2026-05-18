import { carrito } from '../services/carritoStore.js';
import { actualizarBadge } from './Navbar.js';
import { mostrarToast } from './Toast.js';

export function renderSidebar() {
  return `
    <div class="overlay" id="overlay-carrito"></div>
    <aside class="sidebar" id="sidebar-carrito">
      <div class="sidebar-header">
        <h3>🛒 Tu Carrito</h3>
        <button class="btn-cerrar" id="btn-cerrar-carrito">✕</button>
      </div>
      <div class="sidebar-items" id="carrito-items">
        ${renderItems()}
      </div>
      <div class="sidebar-footer">
        <div class="sidebar-total">Total: <span id="carrito-total">$${carrito.total().toLocaleString('es-AR')}</span></div>
        <button class="btn btn-primary" id="btn-confirmar">✅ Confirmar Pedido</button>
        <button class="btn btn-outline btn-sm" id="btn-vaciar">Vaciar carrito</button>
      </div>
    </aside>
  `;
}

function renderItems() {
  if (carrito.items.length === 0) {
    return '<div class="vacio"><p>Tu carrito está vacío</p></div>';
  }
  return carrito.items.map(item => `
    <div class="carrito-item">
      <img src="${item.imagen || 'https://placehold.co/55x55?text=Prod'}" alt="${item.nombre}">
      <div class="carrito-item-info">
        <div class="carrito-item-nombre">${item.nombre}</div>
        <div class="carrito-item-precio">$${(item.precio * item.cantidad).toLocaleString('es-AR')}</div>
        <small style="color:#aaa">Cant: ${item.cantidad} × $${item.precio.toLocaleString('es-AR')}</small>
      </div>
      <button class="btn btn-danger btn-sm" data-quitar="${item.productoId}">🗑</button>
    </div>
  `).join('');
}

export function refrescarSidebar() {
  const cont = document.getElementById('carrito-items');
  const total = document.getElementById('carrito-total');
  if (cont)  cont.innerHTML  = renderItems();
  if (total) total.textContent = `$${carrito.total().toLocaleString('es-AR')}`;
  actualizarBadge();
}

export function initSidebar() {
  document.getElementById('btn-abrir-carrito')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('sidebar-carrito')?.classList.add('abierto');
    document.getElementById('overlay-carrito')?.classList.add('visible');
  });

  document.getElementById('btn-cerrar-carrito')?.addEventListener('click', cerrarSidebar);
  document.getElementById('overlay-carrito')?.addEventListener('click', cerrarSidebar);

  document.getElementById('btn-vaciar')?.addEventListener('click', () => {
    carrito.vaciar();
    refrescarSidebar();
  });

  document.getElementById('carrito-items')?.addEventListener('click', (e) => {
    const id = e.target.dataset.quitar;
    if (id) { carrito.quitar(id); refrescarSidebar(); }
  });

  document.getElementById('btn-confirmar')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-confirmar');
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    try {
      await carrito.confirmarPedido();
      refrescarSidebar();
      cerrarSidebar();
      mostrarToast('🎉 ¡Pedido enviado! Nos contactaremos pronto.', 'success');
    } catch (err) {
      mostrarToast('❌ ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = '✅ Confirmar Pedido';
    }
  });
}

function cerrarSidebar() {
  document.getElementById('sidebar-carrito')?.classList.remove('abierto');
  document.getElementById('overlay-carrito')?.classList.remove('visible');
}
