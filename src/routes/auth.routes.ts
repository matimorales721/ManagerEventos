import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import {
  registerValidator,
  loginValidator,
} from '../validators/auth.validator';
import rateLimit from 'express-rate-limit';

const router = Router();

// Limitar intentos de registro y login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // máximo 5 intentos
  message: 'Demasiados intentos, inténtalo de nuevo más tarde',
});

router.post('/register', authLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);

export default router;