import { renderHome }       from './pages/Home.js';
import { renderCatalogo }   from './pages/Catalogo.js';
import { renderSucursales } from './pages/Sucursales.js';
import { renderLogin }      from './pages/Login.js';
import { renderAdmin }      from './pages/Admin.js';
import { renderProductoDetalle } from './pages/ProductoDetalle.js';

const rutas = {
  '':            renderHome,
  '/':           renderHome,
  '/catalogo':   renderCatalogo,
  '/sucursales': renderSucursales,
  '/login':      renderLogin,
  '/admin':      renderAdmin,
};

function obtenerRuta() {
  return window.location.hash.replace('#', '') || '/';
}

async function navegar() {
  const ruta   = obtenerRuta();
  const app    = document.getElementById('app');
  app.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  if (ruta.startsWith('/producto/')) {
    const id = ruta.split('/producto/')[1];
    await renderProductoDetalle(app, id);
  } else {
    const render = rutas[ruta] || renderHome;
    await render(app);
  }
  window.scrollTo(0, 0);
}

// Intercepta clicks en <a href="/ruta"> y los convierte a hash
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (href && href.startsWith('/') && !href.startsWith('//')) {
    e.preventDefault();
    window.location.hash = href;
  }
});

export function initRouter() {
  window.addEventListener('hashchange', navegar);
  navegar();
}
