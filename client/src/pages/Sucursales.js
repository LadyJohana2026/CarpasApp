import { renderNavbar } from '../components/Navbar.js';
import { renderSidebar, initSidebar } from '../components/Carrito.js';
import { sucursalesService } from '../services/api.js';

export async function renderSucursales(container) {
  container.innerHTML = `
    ${renderNavbar('#/sucursales')}
    ${renderSidebar()}
    <section class="seccion">
      <h2 class="seccion-titulo">Nuestras Sucursales</h2>
      <div id="grid-sucursales" class="grilla">
        <div class="loading"><div class="spinner"></div><p>Cargando sucursales...</p></div>
      </div>
    </section>
    <footer>© 2025 Carpas El Fuerte</footer>
  `;

  initSidebar();

  try {
    const { data } = await sucursalesService.listar();
    const grid = document.getElementById('grid-sucursales');

    if (data.length === 0) {
      grid.innerHTML = `
        <div class="vacio" style="grid-column:1/-1">
          <p>No hay sucursales registradas aún.</p>
          <a href="#/admin" class="btn btn-outline btn-sm" style="margin-top:1rem">⚙️ Cargar sucursales</a>
        </div>`;
      return;
    }

    grid.innerHTML = data.map(s => `
      <div class="tarjeta">
        <div style="background:linear-gradient(135deg,#2d6a4f,#52b788);height:80px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:2.5rem">📍</span>
        </div>
        <div class="tarjeta-body">
          <div class="tarjeta-nombre">${s.nombre}</div>
          <div class="tarjeta-desc" style="display:flex;flex-direction:column;gap:.3rem">
            <div>📌 ${s.direccion}, ${s.ciudad}</div>
            ${s.telefono ? `<div>📞 ${s.telefono}</div>` : ''}
            ${s.email    ? `<div>✉️ ${s.email}</div>`    : ''}
            <div>🕐 ${s.horario}</div>
          </div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    document.getElementById('grid-sucursales').innerHTML =
      `<div class="vacio" style="grid-column:1/-1"><p>Error: ${err.message}</p></div>`;
  }
}
