const BASE = '/api';

async function request(url, options = {}) {
  try {
    const res = await fetch(`${BASE}${url}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });

    const data = await res.json();

    if (!res.ok) {
      const err = new Error(data.message || 'Error en la petición');
      err.errores = data.errores || null;
      err.status  = res.status;
      throw err;
    }

    return data;
  } catch (err) {
    // Si ya es un error nuestro, lo relanzamos
    if (err.status) throw err;
    // Error de red / JSON inválido
    throw new Error('No se pudo conectar con el servidor. Verificá que el backend esté corriendo.');
  }
}

// ── Productos ─────────────────────────────────────────────────────────────────
export const productosService = {
  listar:     ()      => request('/productos'),
  obtener:    (id)    => request(`/productos/${id}`),
  crear:      (body)  => request('/productos',       { method: 'POST',   body: JSON.stringify(body) }),
  actualizar: (id, b) => request(`/productos/${id}`, { method: 'PUT',    body: JSON.stringify(b) }),
  eliminar:   (id)    => request(`/productos/${id}`, { method: 'DELETE' })
};

// ── Carrito ───────────────────────────────────────────────────────────────────
export const carritoService = {
  enviarPedido: (body) => request('/carrito', { method: 'POST', body: JSON.stringify(body) }),
  listar:       ()     => request('/carrito')
};

// ── Sucursales ────────────────────────────────────────────────────────────────
export const sucursalesService = {
  listar:     ()      => request('/sucursales'),
  obtener:    (id)    => request(`/sucursales/${id}`),
  crear:      (body)  => request('/sucursales',       { method: 'POST',   body: JSON.stringify(body) }),
  actualizar: (id, b) => request(`/sucursales/${id}`, { method: 'PUT',    body: JSON.stringify(b) }),
  eliminar:   (id)    => request(`/sucursales/${id}`, { method: 'DELETE' })
};

// ── Usuarios ──────────────────────────────────────────────────────────────────
export const usuariosService = {
  registrar: (body) => request('/usuarios/registro', { method: 'POST', body: JSON.stringify(body) }),
  login:     (body) => request('/usuarios/login',    { method: 'POST', body: JSON.stringify(body) })
};
