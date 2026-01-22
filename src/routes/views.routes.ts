import { Router } from "express";
import * as viewController from "../controllers/view.controller";
import * as authController from "../controllers/auth.controller";
import { authenticate, authenticateOrNot, authorize } from '../middlewares/auth.middleware';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import { UsuarioRol } from "../enums/usuarioRol";

const router = Router();

// Rutas de autenticación (vistas)
router.get("/register", viewController.formRegister);
router.post("/register", registerValidator, authController.register);

router.get("/login", viewController.formLogin);
router.post("/login", loginValidator, authController.login);

router.get("/logout", (req, res) => {
    // Limpiar la cookie del token
    res.clearCookie('token');
    res.redirect('/');
});

// Rutas principales
router.get("/", authenticateOrNot, viewController.home);
router.get("/crear-evento", authenticate, authorize([UsuarioRol.ADMIN]), viewController.formCrearEvento);
router.get("/eventos/:id", authenticate, viewController.eventoDetalle);
router.get("/eventos/:id/reservar", authenticate, viewController.formReservarEntrada);

router.get("/mis-entradas", authenticate, viewController.misEntradas);

router.get("/entradas/:id/pagar", authenticate, viewController.formPagarEntrada);
router.get("/entradas/:id", authenticate, viewController.entradaDetalle);

router.get("/validar-entradas", authenticate, authorize([UsuarioRol.ADMIN]), viewController.formValidarEntradas);
router.post("/validar-entradas/buscar", authenticate, viewController.buscarEntradaValidar);
router.get("/cancelar-vencidas", authenticate, authorize([UsuarioRol.ADMIN]), viewController.mostrarCancelarVencidas);

export default router;
