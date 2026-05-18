import { renderNavbar } from '../components/Navbar.js';
import { renderSidebar, initSidebar, refrescarSidebar } from '../components/Carrito.js';
import { productosService } from '../services/api.js';
import { carrito } from '../services/carritoStore.js';
import { mostrarToast } from '../components/Toast.js';

export async function renderHome(container) {
  container.innerHTML = `
    ${renderNavbar('#/')}
    ${renderSidebar()}
    <div class="hero">
      <h1>🏕️ Carpas El Fuerte</h1>
      <p>Los mejores equipos para tus aventuras al aire libre. Calidad y durabilidad garantizada.</p>
      <a class="btn btn-secondary" href="#/catalogo">Ver catálogo completo</a>
    </div>
    <section class="seccion">
      <h2 class="seccion-titulo">Productos Destacados</h2>
      <div id="productos-home" class="grilla">
        <div class="loading"><div class="spinner"></div><p>Cargando productos...</p></div>
      </div>
    </section>
    <footer>© 2026 Carpas El Fuerte — Todos los derechos reservados</footer>
  `;

  initSidebar();

  try {
    const { data } = await productosService.listar();
    const grid = document.getElementById('productos-home');
    const primeros = data.slice(0, 4);

    if (primeros.length === 0) {
      grid.innerHTML = `
        <div class="vacio" style="grid-column:1/-1">
          <p>No hay productos cargados aún.</p>
          <a href="#/admin" class="btn btn-primary btn-sm" style="margin-top:1rem">
            ⚙️ Ir al Admin para cargar productos
          </a>
        </div>`;
      return;
    }

    grid.innerHTML = primeros.map(p => `
      <div class="tarjeta">
        <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://placehold.co/400x220?text=Sin+imagen'">
        <div class="tarjeta-body">
          <span class="badge-cat">${p.categoria}</span>
          <div class="tarjeta-nombre">${p.nombre}</div>
          <div class="tarjeta-desc">${p.descripcion.slice(0, 80)}...</div>
          <div class="tarjeta-precio">$${p.precio.toLocaleString('es-AR')}</div>
          <button class="btn btn-primary btn-sm" data-prod='${JSON.stringify(p)}'>
            🛒 Agregar
          </button>
        </div>
      </div>
    `).join('');

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-prod]');
      if (!btn) return;
      const prod = JSON.parse(btn.dataset.prod);
      carrito.agregar(prod);
      refrescarSidebar();
      mostrarToast(`✅ "${prod.nombre}" agregado al carrito`, 'success');
    });

  } catch (err) {
    document.getElementById('productos-home').innerHTML =
      `<div class="vacio" style="grid-column:1/-1"><p>Error al cargar productos: ${err.message}</p></div>`;
  }
}
