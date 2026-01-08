import { Router } from "express";
import { mockUserMiddleware } from "../middleware/mockUser";
import * as viewController from "../controllers/view.controller";

const router = Router();

// Aplicar middleware de usuario mockeado a todas las rutas
router.use(mockUserMiddleware);

// Rutas
router.get("/", (req, res) => viewController.home(req, res));

router.get("/eventos/:id", (req, res) => viewController.eventoDetalle(req, res));

router.get("/eventos/:id/reservar", (req, res) => viewController.formReservarEntrada(req, res));
router.post("/eventos/:id/reservar", (req, res) => viewController.procesarReserva(req, res));

router.get("/entradas/:id/pagar", (req, res) => viewController.formPagarEntrada(req, res));
router.post("/entradas/:id/pagar", (req, res) => viewController.procesarPago(req, res));

router.get("/mis-entradas", (req, res) => viewController.misEntradas(req, res));

router.get("/entradas/:id", (req, res) => viewController.entradaDetalle(req, res));

router.get("/validar-entradas", (req, res) => viewController.formValidarEntradas(req, res));
router.post("/validar-entradas/buscar", (req, res) => viewController.buscarEntradaValidar(req, res));
router.post("/validar-entradas/:codigo", (req, res) => viewController.validarEntrada(req, res));

export default router;
