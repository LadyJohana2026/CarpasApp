import { renderNavbar } from '../components/Navbar.js';
import { renderSidebar, initSidebar } from '../components/Carrito.js';
import { productosService, sucursalesService } from '../services/api.js';
import { mostrarToast } from '../components/Toast.js';

export function renderAdmin(container) {
  container.innerHTML = `
    ${renderNavbar('#/admin')}
    ${renderSidebar()}
    <section class="seccion">
      <h2 class="seccion-titulo">⚙️ Panel de Administración</h2>

      <!-- TABS -->
      <div style="display:flex;gap:.5rem;margin-bottom:2rem;border-bottom:2px solid #eee;padding-bottom:.5rem">
        <button class="btn btn-primary tab-btn" data-tab="productos">📦 Productos</button>
        <button class="btn btn-outline tab-btn" data-tab="sucursales">📍 Sucursales</button>
      </div>

      <!-- PANEL PRODUCTOS -->
      <div id="tab-productos">
        <h3 style="margin-bottom:1rem;color:var(--verde)">Agregar Producto</h3>
        <div class="form-card" style="max-width:600px;margin:0">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="campo">
              <label>Nombre *</label>
              <input type="text" id="p-nombre" placeholder="Carpa Premium 6x3m">
            </div>
            <div class="campo">
              <label>Precio *</label>
              <input type="number" id="p-precio" placeholder="85000">
            </div>
          </div>
          <div class="campo">
            <label>Descripción *</label>
            <textarea id="p-desc" rows="2" placeholder="Descripción del producto (mín. 10 caracteres)" style="width:100%;padding:.55rem .8rem;border:2px solid #ddd;border-radius:8px;font-size:.95rem;resize:vertical"></textarea>
          </div>
          <div class="campo">
            <label>URL Imagen *</label>
            <input type="text" id="p-imagen" placeholder="https://placehold.co/400x220?text=Carpa">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="campo">
              <label>Categoría</label>
              <select id="p-categoria">
                <option value="carpas">Carpas</option>
                <option value="parasoles">Parasoles</option>
                <option value="accesorios">Accesorios</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <div class="campo">
              <label>Stock</label>
              <input type="number" id="p-stock" placeholder="10" value="10">
            </div>
          </div>
          <button class="btn btn-primary" id="btn-crear-producto" style="width:100%">➕ Crear Producto</button>
        </div>

        <h3 style="margin:2rem 0 1rem;color:var(--verde)">Productos existentes</h3>
        <div id="lista-productos"><div class="loading"><div class="spinner"></div></div></div>
      </div>

      <!-- PANEL SUCURSALES -->
      <div id="tab-sucursales" style="display:none">
        <h3 style="margin-bottom:1rem;color:var(--verde)">Agregar Sucursal</h3>
        <div class="form-card" style="max-width:600px;margin:0">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="campo">
              <label>Nombre *</label>
              <input type="text" id="s-nombre" placeholder="Sucursal Centro">
            </div>
            <div class="campo">
              <label>Ciudad *</label>
              <input type="text" id="s-ciudad" placeholder="Buenos Aires">
            </div>
          </div>
          <div class="campo">
            <label>Dirección *</label>
            <input type="text" id="s-direccion" placeholder="Av. Corrientes 1234">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="campo">
              <label>Teléfono</label>
              <input type="text" id="s-telefono" placeholder="+54 11 1234-5678">
            </div>
            <div class="campo">
              <label>Email</label>
              <input type="email" id="s-email" placeholder="sucursal@carpas.com">
            </div>
          </div>
          <div class="campo">
            <label>Horario</label>
            <input type="text" id="s-horario" placeholder="Lun-Vie 9:00-18:00" value="Lun-Vie 9:00-18:00">
          </div>
          <button class="btn btn-primary" id="btn-crear-sucursal" style="width:100%">➕ Crear Sucursal</button>
        </div>

        <h3 style="margin:2rem 0 1rem;color:var(--verde)">Sucursales existentes</h3>
        <div id="lista-sucursales"><div class="loading"><div class="spinner"></div></div></div>
      </div>

      <!-- PANEL SEED -->
      <div id="tab-seed" style="display:none">
        <div class="form-card" style="max-width:500px;margin:0">
          
          <p style="color:#666;margin-bottom:1.5rem;font-size:.95rem">
            Esto carga automáticamente 4 productos y 2 sucursales de ejemplo para que puedas ver la app funcionando.
          </p>
          <button class="btn btn-primary" id="btn-seed" style="width:100%">🚀 Cargar datos de prueba</button>
          <div id="seed-resultado" style="margin-top:1rem"></div>
        </div>
      </div>
    </section>
    <footer>© 2026 Carpas El Fuerte</footer>
  `;

  initSidebar();
  initTabs();
  cargarListaProductos();
  bindCrearProducto();
  bindCrearSucursal();
  bindSeed();
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.className = 'btn btn-outline tab-btn';
      });
      btn.className = 'btn btn-primary tab-btn';
      ['productos', 'sucursales', 'seed'].forEach(t => {
        document.getElementById(`tab-${t}`).style.display = 'none';
      });
      const tab = btn.dataset.tab;
      document.getElementById(`tab-${tab}`).style.display = 'block';
      if (tab === 'sucursales') cargarListaSucursales();
    });
  });
}

// ── Lista productos ───────────────────────────────────────────────────────────
async function cargarListaProductos() {
  const cont = document.getElementById('lista-productos');
  try {
    const { data } = await productosService.listar();
    if (data.length === 0) {
      cont.innerHTML = '<div class="vacio"><p>No hay productos. Creá uno arriba o usá "Cargar datos de prueba".</p></div>';
      return;
    }
    cont.innerHTML = `<table style="width:100%;border-collapse:collapse;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)">
      <thead style="background:var(--verde);color:white">
        <tr>
          <th style="padding:.8rem 1rem;text-align:left">Imagen</th><th style="padding:.8rem 1rem;text-align:left">Nombre</th>
          <th style="padding:.8rem 1rem;text-align:left">Categoría</th>
          <th style="padding:.8rem 1rem;text-align:left">Precio</th>
          <th style="padding:.8rem 1rem;text-align:left">Stock</th>
          <th style="padding:.8rem 1rem;text-align:left">Acción</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(p => `
          <tr style="border-bottom:1px solid #f0f0f0">
            <td style="padding:.8rem 1rem"><img src="${p.imagen}" style="width:70px;height:50px;object-fit:cover;border-radius:8px" onerror="this.src='https://placehold.co/70x50'"></td>
            <td style="padding:.8rem 1rem">${p.nombre}</td>
            <td style="padding:.8rem 1rem"><span class="badge-cat">${p.categoria}</span></td>
            <td style="padding:.8rem 1rem;font-weight:700;color:var(--verde)">$${p.precio.toLocaleString('es-AR')}</td>
            <td style="padding:.8rem 1rem">${p.stock}</td>
            <td style="padding:.8rem 1rem">
              <button class="btn btn-outline btn-sm" data-id="${p._id}">✏️ Editar</button> <button class="btn btn-danger btn-sm" data-eliminar-prod="${p._id}">🗑 Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;

    cont.addEventListener('click', async (e) => {
      const editarId = e.target.dataset.id;
      if (editarId) {
        const producto = data.find(x=>x._id===editarId);
        const nombre = prompt("Nombre", producto.nombre);
        if (!nombre) return;
        const precio = prompt("Precio", producto.precio);
        const descripcion = prompt("Descripción", producto.descripcion);
        const imagen = prompt("URL imagen", producto.imagen);
        const categoria = prompt("Categoría", producto.categoria);
        const stock = prompt("Stock", producto.stock);
        await productosService.actualizar(editarId,{nombre,precio,descripcion,imagen,categoria,stock});
        mostrarToast("Producto actualizado",'success');
        return cargarListaProductos();
      }

      const id = e.target.dataset.eliminarProd;
      if (!id) return;
      if (!confirm('¿Eliminar este producto?')) return;
      try {
        await productosService.eliminar(id);
        mostrarToast('Producto eliminado', 'success');
        cargarListaProductos();
      } catch (err) {
        mostrarToast('Error: ' + err.message, 'error');
      }
    });
  } catch (err) {
    cont.innerHTML = `<div class="vacio"><p>Error: ${err.message}</p></div>`;
  }
}

// ── Lista sucursales ──────────────────────────────────────────────────────────
async function cargarListaSucursales() {
  const cont = document.getElementById('lista-sucursales');
  try {
    const { data } = await sucursalesService.listar();
    if (data.length === 0) {
      cont.innerHTML = '<div class="vacio"><p>No hay sucursales. Creá una arriba o usá "Cargar datos de prueba".</p></div>';
      return;
    }
    cont.innerHTML = `<table style="width:100%;border-collapse:collapse;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)">
      <thead style="background:var(--verde);color:white">
        <tr>
          <th style="padding:.8rem 1rem;text-align:left">Nombre</th>
          <th style="padding:.8rem 1rem;text-align:left">Ciudad</th>
          <th style="padding:.8rem 1rem;text-align:left">Dirección</th>
          <th style="padding:.8rem 1rem;text-align:left">Teléfono</th>
          <th style="padding:.8rem 1rem;text-align:left">Acción</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(s => `
          <tr style="border-bottom:1px solid #f0f0f0">
            <td style="padding:.8rem 1rem;font-weight:600">${s.nombre}</td>
            <td style="padding:.8rem 1rem">${s.ciudad}</td>
            <td style="padding:.8rem 1rem">${s.direccion}</td>
            <td style="padding:.8rem 1rem">${s.telefono || '-'}</td>
            <td style="padding:.8rem 1rem">
              <button class="btn btn-outline btn-sm" data-editar-suc="${s._id}">✏️ Editar</button> <button class="btn btn-danger btn-sm" data-eliminar-suc="${s._id}">🗑 Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;

    cont.addEventListener('click', async (e) => {
      const editarId = e.target.dataset.editarSuc;
      if (editarId) {
        const sucursal = data.find(x=>x._id===editarId);
        const nombre = prompt("Nombre", sucursal.nombre);
        if (!nombre) return;
        const ciudad = prompt("Ciudad", sucursal.ciudad);
        const direccion = prompt("Dirección", sucursal.direccion);
        const telefono = prompt("Teléfono", sucursal.telefono || "");
        const email = prompt("Email", sucursal.email || "");
        const horario = prompt("Horario", sucursal.horario || "");
        await sucursalesService.actualizar(editarId,{nombre,ciudad,direccion,telefono,email,horario});
        mostrarToast("Sucursal actualizada",'success');
        return cargarListaSucursales();
      }

      const id = e.target.dataset.eliminarSuc;
      if (!id) return;
      if (!confirm('¿Eliminar esta sucursal?')) return;
      try {
        await sucursalesService.eliminar(id);
        mostrarToast('Sucursal eliminada', 'success');
        cargarListaSucursales();
      } catch (err) {
        mostrarToast('Error: ' + err.message, 'error');
      }
    });
  } catch (err) {
    cont.innerHTML = `<div class="vacio"><p>Error: ${err.message}</p></div>`;
  }
}

// ── Crear producto ────────────────────────────────────────────────────────────
function bindCrearProducto() {
  document.getElementById('btn-crear-producto')?.addEventListener('click', async () => {
    const nombre    = document.getElementById('p-nombre').value.trim();
    const precio    = parseFloat(document.getElementById('p-precio').value);
    const descripcion = document.getElementById('p-desc').value.trim();
    const imagen    = document.getElementById('p-imagen').value.trim() || 'https://placehold.co/400x220?text=Producto';
    const categoria = document.getElementById('p-categoria').value;
    const stock     = parseInt(document.getElementById('p-stock').value) || 0;

    if (!nombre || !precio || !descripcion) {
      mostrarToast('⚠️ Completá los campos obligatorios (*)','warning'); return;
    }

    const btn = document.getElementById('btn-crear-producto');
    btn.disabled = true; btn.textContent = 'Guardando...';
    try {
      await productosService.crear({ nombre, precio, descripcion, imagen, categoria, stock });
      mostrarToast('✅ Producto creado correctamente', 'success');
      ['p-nombre','p-precio','p-desc','p-imagen','p-stock'].forEach(id => document.getElementById(id).value = '');
      cargarListaProductos();
    } catch (err) {
      mostrarToast('❌ ' + err.message, 'error');
    } finally {
      btn.disabled = false; btn.textContent = '➕ Crear Producto';
    }
  });
}

// ── Crear sucursal ────────────────────────────────────────────────────────────
function bindCrearSucursal() {
  document.getElementById('btn-crear-sucursal')?.addEventListener('click', async () => {
    const nombre    = document.getElementById('s-nombre').value.trim();
    const ciudad    = document.getElementById('s-ciudad').value.trim();
    const direccion = document.getElementById('s-direccion').value.trim();
    const telefono  = document.getElementById('s-telefono').value.trim();
    const email     = document.getElementById('s-email').value.trim();
    const horario   = document.getElementById('s-horario').value.trim();

    if (!nombre || !ciudad || !direccion) {
      mostrarToast('⚠️ Completá los campos obligatorios (*)','warning'); return;
    }

    const btn = document.getElementById('btn-crear-sucursal');
    btn.disabled = true; btn.textContent = 'Guardando...';
    try {
      await sucursalesService.crear({ nombre, ciudad, direccion, telefono, email, horario });
      mostrarToast('✅ Sucursal creada correctamente', 'success');
      ['s-nombre','s-ciudad','s-direccion','s-telefono','s-email'].forEach(id => document.getElementById(id).value = '');
      cargarListaSucursales();
    } catch (err) {
      mostrarToast('❌ ' + err.message, 'error');
    } finally {
      btn.disabled = false; btn.textContent = '➕ Crear Sucursal';
    }
  });
}

// ── Seed datos de prueba ──────────────────────────────────────────────────────
function bindSeed() {
  document.getElementById('btn-seed')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-seed');
    const res = document.getElementById('seed-resultado');
    btn.disabled = true; btn.textContent = 'Cargando datos...';
    res.innerHTML = '';

    const productos = [
      { nombre: 'Carpa Familiar 6x3m', precio: 85000, descripcion: 'Carpa de aluminio para familia, lona 300gr impermeable, incluye bolso de transporte', imagen: 'https://placehold.co/400x220/2d6a4f/white?text=Carpa+6x3m', categoria: 'carpas', stock: 8 },
      { nombre: 'Carpa Camping 3x3m',  precio: 45000, descripcion: 'Ideal para camping y eventos al aire libre, fácil armado en 15 minutos', imagen: 'https://placehold.co/400x220/52b788/white?text=Carpa+3x3m', categoria: 'carpas', stock: 15 },
      { nombre: 'Parasol Playa 2.5m',  precio: 22000, descripcion: 'Parasol reforzado para playa y jardín, resistente al viento, incluye bolsa', imagen: 'https://placehold.co/400x220/e9c46a/white?text=Parasol', categoria: 'parasoles', stock: 20 },
      { nombre: 'Kit Accesorios Carpa', precio: 12000, descripcion: 'Kit completo con estacas, tensores y bolsa de reparación para carpas', imagen: 'https://placehold.co/400x220/e76f51/white?text=Accesorios', categoria: 'accesorios', stock: 30 },
    ];

    const sucursales = [
      { nombre: 'Sucursal Centro', ciudad: 'Buenos Aires', direccion: 'Av. Corrientes 1234', telefono: '+54 11 4444-5555', email: 'centro@carpas.com', horario: 'Lun-Vie 9:00-18:00, Sáb 9:00-13:00' },
      { nombre: 'Sucursal Norte',  ciudad: 'Córdoba',      direccion: 'Bv. Chacabuco 750',  telefono: '+54 351 333-4444', email: 'norte@carpas.com',  horario: 'Lun-Vie 9:00-17:00' },
    ];

    let ok = 0, errores = 0;

    for (const p of productos) {
      try { await productosService.crear(p); ok++; }
      catch { errores++; }
    }
    for (const s of sucursales) {
      try { await sucursalesService.crear(s); ok++; }
      catch { errores++; }
    }

    res.innerHTML = `
      <div style="padding:1rem;background:${errores === 0 ? '#e8f5ee' : '#fff3cd'};border-radius:8px;margin-top:.5rem">
        ✅ ${ok} registros creados ${errores > 0 ? `— ⚠️ ${errores} errores` : ''}.<br>
        <a href="#/catalogo" style="color:var(--verde);font-weight:700">→ Ver catálogo</a> &nbsp;
        <a href="#/sucursales" style="color:var(--verde);font-weight:700">→ Ver sucursales</a>
      </div>`;

    btn.disabled = false; btn.textContent = '🚀 Cargar datos de prueba';
    mostrarToast(`✅ ${ok} registros cargados`, 'success');
  });
}
