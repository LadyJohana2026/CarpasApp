const { body } = require('express-validator');

const reglasCarrito = [
  body('items')
    .isArray({ min: 1 }).withMessage('El carrito debe contener al menos un producto'),

  body('items.*.productoId')
    .notEmpty().withMessage('Cada item debe tener un productoId'),

  body('items.*.nombre')
    .trim()
    .notEmpty().withMessage('Cada item debe tener un nombre'),

  body('items.*.precio')
    .isFloat({ min: 0 }).withMessage('El precio de cada item debe ser un número positivo'),

  body('items.*.cantidad')
    .isInt({ min: 1 }).withMessage('La cantidad de cada item debe ser al menos 1'),

  body('total')
    .notEmpty().withMessage('El total es obligatorio')
    .isFloat({ min: 0 }).withMessage('El total debe ser un número positivo')
];

module.exports = { reglasCarrito };
