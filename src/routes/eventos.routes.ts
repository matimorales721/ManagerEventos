import { Router } from "express";
import { EventoController } from "../controllers/EventoController";
import { EventoService } from "../services/EventoService";
import { FileEventRepository } from "../persistence/file/FileEventRepository";
import { MySQLEventRepository } from "../persistence/db/MySQLEventRepository";

const router = Router();

// Inicialización de repositorios, servicios y controladores
// Elige UNO de los siguientes repositorios:
//const eventoRepository = new FileEventRepository();  // Repositorio basado en archivos JSON
const eventoRepository = new MySQLEventRepository();  // Repositorio basado en MySQL

const eventoService = new EventoService(eventoRepository);
const eventoController = new EventoController(eventoService);

router.post("/", eventoController.crearEvento);
router.get("/", eventoController.listarEventos);
router.get("/:id", eventoController.obtenerEvento);

export default router;
