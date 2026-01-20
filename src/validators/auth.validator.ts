import { body } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const validatePassword: ValidationChain[] = [
    body('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/\d/)
        .withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Z]/)
        .withMessage('La contraseña debe contener al menos una mayúscula')
        .matches(/[^A-Za-z0-9]/)
        .withMessage('La contraseña debe contener al menos un carácter especial'),
];

export const validateEmail: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
];

export const validateUsername: ValidationChain[] = [
    body('username')
        .isLength({ min: 3 })
        .withMessage('El nombre de usuario debe tener al menos 3 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
];

export const validateNombre: ValidationChain[] = [
    body('nombre')
        .isLength({ min: 2 })
        .withMessage('El nombre debe tener al menos 2 caracteres'),
];

export const validateFechaNacimiento: ValidationChain[] = [
    body('fechaNacimiento')
        .isISO6391()
        .withMessage('La fecha de nacimiento debe estar en formato ISO 6391 (YYYY-MM-DD)'),
];

export const validateApellido: ValidationChain[] = [
    body('apellido')
        .isLength({ min: 2 })
        .withMessage('El apellido debe tener al menos 2 caracteres'),
];

export const registerValidator: ValidationChain[] = [
    ...validateEmail,
    ...validatePassword,
    ...validateUsername,
    ...validateNombre,
    ...validateApellido,
];

export const loginValidator: ValidationChain[] = [
    ...validateEmail,
    body('password').notEmpty().withMessage('La contraseña es requerida'),
];