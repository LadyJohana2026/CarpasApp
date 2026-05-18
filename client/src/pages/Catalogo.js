import { renderNavbar } from '../components/Navbar.js';
import { renderSidebar, initSidebar, refrescarSidebar } from '../components/Carrito.js';
import { productosService } from '../services/api.js';
import { carrito } from '../services/carritoStore.js';
import { mostrarToast } from '../components/Toast.js';

export async function renderCatalogo(container) {
  container.innerHTML = `
    ${renderNavbar('#/catalogo')}
    ${renderSidebar()}
    <section class="seccion">
      <h2 class="seccion-titulo">Catálogo de Productos</h2>
      <div style="margin-bottom:1.5rem;display:flex;gap:.8rem;flex-wrap:wrap">
        <button class="btn btn-primary filtro-btn" data-cat="todos">Todos</button>
        <button class="btn btn-outline filtro-btn" data-cat="carpas">Carpas</button>
        <button class="btn btn-outline filtro-btn" data-cat="parasoles">Parasoles</button>
        <button class="btn btn-outline filtro-btn" data-cat="accesorios">Accesorios</button>
        <button class="btn btn-outline filtro-btn" data-cat="otros">Otros</button>
      </div>
      <div id="grid-catalogo" class="grilla">
        <div class="loading"><div class="spinner"></div><p>Cargando...</p></div>
      </div>
    </section>
    <footer>© 2026 Carpas El Fuerte</footer>
  `;

  initSidebar();

  let todosLosProductos = [];

  try {
    const { data } = await productosService.listar();
    todosLosProductos = data;
    renderGrilla(todosLosProductos);
  } catch (err) {
    document.getElementById('grid-catalogo').innerHTML =
      `<div class="vacio" style="grid-column:1/-1"><p>Error: ${err.message}</p></div>`;
  }

  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro-btn').forEach(b => {
        b.className = 'btn btn-outline filtro-btn';
      });
      btn.className = 'btn btn-primary filtro-btn';
      const cat = btn.dataset.cat;
      const filtrados = cat === 'todos'
        ? todosLosProductos
        : todosLosProductos.filter(p => p.categoria === cat);
      renderGrilla(filtrados);
    });
  });

  function renderGrilla(productos) {
    const grid = document.getElementById('grid-catalogo');
    if (productos.length === 0) {
      grid.innerHTML = `
        <div class="vacio" style="grid-column:1/-1">
          <p>No hay productos en esta categoría.</p>
          <a href="#/admin" class="btn btn-outline btn-sm" style="margin-top:1rem">⚙️ Cargar productos</a>
        </div>`;
      return;
    }
    grid.innerHTML = productos.map(p => `
      <div class="tarjeta">
        <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://placehold.co/400x220?text=Sin+imagen'">
        <div class="tarjeta-body">
          <span class="badge-cat">${p.categoria}</span>
          <div class="tarjeta-nombre">${p.nombre}</div>
          <div class="tarjeta-desc">${p.descripcion}</div>
          <div class="tarjeta-precio">$${p.precio.toLocaleString('es-AR')}</div>
          <small style="color:#aaa">Stock: ${p.stock ?? 0}</small>
          <div style="display:flex;gap:.5rem;margin-top:1rem;flex-wrap:wrap">
            <a href="#/producto/${p._id}" class="btn btn-outline btn-sm">👁 Ver detalles</a>
            <button class="btn btn-primary btn-sm" data-prod='${JSON.stringify(p)}'>🛒 Agregar</button>
          </div>
        </div>
      </div>
    `).join('');

    // Un solo listener en el grid (event delegation)
    grid.onclick = (e) => {
      const btn = e.target.closest('[data-prod]');
      if (!btn) return;
      const prod = JSON.parse(btn.dataset.prod);
      carrito.agregar(prod);
      refrescarSidebar();
      mostrarToast(`✅ "${prod.nombre}" agregado`, 'success');
    };
  }
}
