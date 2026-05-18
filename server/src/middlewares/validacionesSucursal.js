const { body, param } = require('express-validator');

const reglasSucursal = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre de la sucursal es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

  body('direccion')
    .trim()
    .notEmpty().withMessage('La dirección es obligatoria'),

  body('ciudad')
    .trim()
    .notEmpty().withMessage('La ciudad es obligatoria'),

  body('telefono')
    .optional({ checkFalsy: true })
    .matches(/^[\d\s\+\-\(\)]+$/).withMessage('El teléfono solo puede contener números y símbolos +-()'),

  body('email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('El email de la sucursal no es válido')
    .normalizeEmail(),

  body('horario')
    .optional()
    .isLength({ max: 100 }).withMessage('El horario no puede superar los 100 caracteres')
];

const reglasId = [
  param('id')
    .isMongoId().withMessage('El ID no es válido')
];

module.exports = { reglasSucursal, reglasId };
