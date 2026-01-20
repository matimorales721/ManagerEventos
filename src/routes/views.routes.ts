import { Router } from "express";
import * as viewController from "../controllers/view.controller";
import * as authController from "../controllers/auth.controller";
import { authenticate } from '../middlewares/auth.middleware';
import { registerValidator, loginValidator } from '../validators/auth.validator';

const router = Router();

// Rutas de autenticación (vistas)
router.get("/register", viewController.formRegister);
router.post("/register", registerValidator, authController.register);

router.get("/login", viewController.formLogin);
router.post("/login", loginValidator, authController.login);

router.get("/logout", (req, res) => {
    res.redirect('/');
});

// Rutas principales
router.get("/", (req, res) => viewController.home(req, res));

router.get("/eventos/:id", (req, res) => viewController.eventoDetalle(req, res));

router.get("/eventos/:id/reservar", (req, res) => viewController.formReservarEntrada(req, res)); // authenticate

router.get("/entradas/:id/pagar", (req, res) => viewController.formPagarEntrada(req, res)); // authenticate

router.get("/mis-entradas", (req, res) => viewController.misEntradas(req, res)); // authenticate

router.get("/entradas/:id", (req, res) => viewController.entradaDetalle(req, res));

router.get("/validar-entradas", (req, res) => viewController.formValidarEntradas(req, res)); // authenticate and authorize([UsuarioRol.ADMIN])
router.post("/validar-entradas/buscar", (req, res) => viewController.buscarEntradaValidar(req, res)); // authenticate

export default router;
