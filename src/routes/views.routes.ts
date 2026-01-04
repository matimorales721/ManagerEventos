import { Router } from "express";
import { ViewController } from "../controllers/ViewController";
import { EventoService } from "../services/EventoService";
import { EntradaService } from "../services/EntradaService";
import { MySQLEventRepository } from "../persistence/db/MySQLEventRepository";
import { MySQLTicketRepository } from "../persistence/db/MySQLTicketRepository";
import { MySQLUserRepository } from "../persistence/db/MySQLUserRepository";
import { mockUserMiddleware } from "../middleware/mockUser";

const router = Router();

// Repositorios
const eventoRepository = new MySQLEventRepository();
const entradaRepository = new MySQLTicketRepository();
const usuarioRepository = new MySQLUserRepository();

// Servicios
const eventoService = new EventoService(eventoRepository);
const entradaService = new EntradaService(entradaRepository, eventoRepository, usuarioRepository);

// Controlador
const viewController = new ViewController(eventoService, entradaService);

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
