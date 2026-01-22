import { body } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const validateEvento: ValidationChain[] = [
    body('titulo')
        .isLength({ min: 2 })
        .withMessage('El título debe tener al menos 2 caracteres'),
    body('descripcion')
        .isLength({ min: 10 })
        .withMessage('La descripción debe tener al menos 10 caracteres'),
    body('fechaHora')
        .isISO8601()
        .withMessage('La fecha y hora debe estar en formato ISO 8601'),
    body('cupoTotal')
        .isInt({ min: 1 })
        .withMessage('El cupo total debe ser un número entero mayor a cero'),
];