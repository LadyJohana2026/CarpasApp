const { body, param } = require('express-validator');

const categoriasValidas = ['carpas', 'parasoles', 'accesorios', 'otros'];

// Reglas para crear / actualizar un producto
const reglasProducto = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),

  body('descripcion')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 5 }).withMessage('La descripción debe tener al menos 5 caracteres'),

  body('imagen')
    .trim()
    .notEmpty().withMessage('La URL de imagen es obligatoria')
    .isURL().withMessage('La imagen debe ser una URL válida'),

  body('categoria')
    .optional()
    .isIn(categoriasValidas)
    .withMessage(`La categoría debe ser una de: ${categoriasValidas.join(', ')}`),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero no negativo')
];

// Validar que el :id sea un ObjectId válido de MongoDB
const reglasId = [
  param('id')
    .isMongoId().withMessage('El ID no es válido')
];

module.exports = { reglasProducto, reglasId };
