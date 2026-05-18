import { carrito } from '../services/carritoStore.js';

export function renderNavbar(paginaActual = '') {
  const links = [
    { href: '#/',           label: 'Inicio' },
    { href: '#/catalogo',   label: 'Catálogo' },
    { href: '#/sucursales', label: 'Sucursales' },
    { href: '#/admin',      label: '⚙️ Admin' },
    { href: '#/login',      label: 'Login' },
  ];

  return `
    <nav>
      <a class="nav-logo" href="#/">🏕️ Carpas El Fuerte</a>
      <ul class="nav-links">
        ${links.map(l => `
          <li><a href="${l.href}" ${paginaActual === l.href ? 'style="color:white;font-weight:700"' : ''}>
            ${l.label}
          </a></li>
        `).join('')}
        <li>
          <a href="#" id="btn-abrir-carrito">
            🛒 Carrito
            <span class="nav-badge" id="badge-carrito" style="display:${carrito.cantidadTotal() > 0 ? 'inline-flex' : 'none'}">
              ${carrito.cantidadTotal()}
            </span>
          </a>
        </li>
      </ul>
    </nav>
  `;
}

export function actualizarBadge() {
  const badge = document.getElementById('badge-carrito');
  if (!badge) return;
  const total = carrito.cantidadTotal();
  badge.textContent = total;
  badge.style.display = total > 0 ? 'inline-flex' : 'none';
}
