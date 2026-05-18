import { renderNavbar } from '../components/Navbar.js';
import { renderSidebar, initSidebar, refrescarSidebar } from '../components/Carrito.js';
import { productosService } from '../services/api.js';
import { carrito } from '../services/carritoStore.js';
import { mostrarToast } from '../components/Toast.js';

export async function renderProductoDetalle(container, id) {
  container.innerHTML = `
    ${renderNavbar('#/catalogo')}
    ${renderSidebar()}
    <section class="seccion">
      <div id="detalle-producto"><div class="loading"><div class="spinner"></div></div></div>
    </section>`;

  initSidebar();

  try {
    const { data:p } = await productosService.obtener(id);
    document.getElementById('detalle-producto').innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;background:white;padding:2rem;border-radius:20px;box-shadow:0 4px 20px rgba(0,0,0,.08)">
        <div>
          <img src="${p.imagen}" alt="${p.nombre}" style="width:100%;border-radius:16px;max-height:500px;object-fit:cover" onerror="this.src='https://placehold.co/600x400?text=Sin+imagen'">
        </div>
        <div>
          <span class="badge-cat">${p.categoria}</span>
          <h1 style="margin:1rem 0;color:var(--verde)">${p.nombre}</h1>
          <p style="line-height:1.7;color:#555">${p.descripcion}</p>
          <h2 style="margin:1.5rem 0;color:var(--verde)">$${p.precio.toLocaleString('es-AR')}</h2>
          <p><strong>Stock disponible:</strong> ${p.stock}</p>
          <div style="display:flex;gap:1rem;margin-top:2rem">
            <button id="btn-agregar" class="btn btn-primary">🛒 Agregar al carrito</button>
            <a href="#/catalogo" class="btn btn-outline">⬅ Volver</a>
          </div>
        </div>
      </div>`;

      document.getElementById('btn-agregar').addEventListener('click', ()=>{
        carrito.agregar(p);
        refrescarSidebar();
        mostrarToast(`✅ ${p.nombre} agregado`, 'success');
      })
  } catch(err){
    document.getElementById('detalle-producto').innerHTML = `<div class="vacio"><p>${err.message}</p></div>`
  }
}
