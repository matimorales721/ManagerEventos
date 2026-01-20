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
router.get("/", authenticateOrNot, (req, res) => viewController.home(req, res));

router.get("/eventos/:id", authenticate, (req, res) => viewController.eventoDetalle(req, res));
router.get("/eventos/:id/reservar", authenticate, (req, res) => viewController.formReservarEntrada(req, res));

router.get("/mis-entradas", authenticate, (req, res) => viewController.misEntradas(req, res)); // authenticate

router.get("/entradas/:id/pagar", authenticate, (req, res) => viewController.formPagarEntrada(req, res));

router.get("/entradas/:id", authenticate, (req, res) => viewController.entradaDetalle(req, res));

router.get("/validar-entradas", authenticate, authorize([UsuarioRol.ADMIN]), (req, res) => viewController.formValidarEntradas(req, res)); // authenticate and authorize([UsuarioRol.ADMIN])
router.post("/validar-entradas/buscar", authenticate, (req, res) => viewController.buscarEntradaValidar(req, res)); // authenticate

router.get("/cancelar-vencidas", authenticate, authorize([UsuarioRol.ADMIN]), (req, res) => viewController.mostrarCancelarVencidas(req, res)); // authenticate and authorize([UsuarioRol.ADMIN])

export default router;
