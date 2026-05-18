const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const productoRoutes  = require('./routes/productoRoutes');
const carritoRoutes   = require('./routes/carritoRoutes');
const sucursalRoutes  = require('./routes/sucursalRoutes');
const usuarioRoutes   = require('./routes/usuarioRoutes');

const app = express();

// ── CORS: permite peticiones desde el frontend Vite ──────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rutas API ─────────────────────────────────────────────────────────────────
app.use('/api/productos',  productoRoutes);
app.use('/api/carrito',    carritoRoutes);
app.use('/api/sucursales', sucursalRoutes);
app.use('/api/usuarios',   usuarioRoutes);

// ── Health check (útil para Railway/Render) ───────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ ok: true, status: 'running', timestamp: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, message: `Ruta ${req.method} ${req.path} no encontrada` });
});

// ── Error handler global ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error inesperado:', err);
  res.status(500).json({ ok: false, message: 'Error interno del servidor', error: err.message });
});

module.exports = app;
