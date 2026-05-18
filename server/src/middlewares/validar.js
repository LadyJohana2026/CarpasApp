const { validationResult } = require('express-validator');

/**
 * Middleware que revisa los errores de express-validator.
 * Si hay errores los devuelve como JSON 422, si no llama a next().
 */
const validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(422).json({
      ok: false,
      message: 'Error de validación',
      errores: errores.array().map(e => ({
        campo: e.path,
        mensaje: e.msg,
        valor: e.value
      }))
    });
  }
  next();
};

module.exports = validar;
