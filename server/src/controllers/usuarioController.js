const Usuario = require('../models/usuarioModel');

// POST /api/usuarios/registro
const registrar = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(409).json({ ok: false, message: 'Ya existe un usuario con ese email' });
    }

    // Nota: en producción real, hashear la contraseña con bcrypt antes de guardar.
    // Ejemplo: const hash = await bcrypt.hash(password, 10);
    const usuario = new Usuario({ nombre, email, password });
    await usuario.save();

    // No devolver la contraseña en la respuesta
    const { password: _, ...usuarioSinPassword } = usuario.toObject();

    res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente',
      data: usuarioSinPassword
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al registrar el usuario', error: error.message });
  }
};

// POST /api/usuarios/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ ok: false, message: 'Email o contraseña incorrectos' });
    }

    const { password: _, ...usuarioSinPassword } = usuario.toObject();

    res.json({
      ok: true,
      message: 'Login exitoso',
      data: usuarioSinPassword
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al iniciar sesión', error: error.message });
  }
};

// GET /api/usuarios
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json({ ok: true, total: usuarios.length, data: usuarios });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener usuarios', error: error.message });
  }
};

module.exports = { registrar, login, listarUsuarios };
