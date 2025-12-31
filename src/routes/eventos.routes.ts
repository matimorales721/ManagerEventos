import { Router } from "express";
import { EventoController } from "../controllers/EventoController";
import { EventoService } from "../services/EventoService";
import { FileEventRepository } from "../persistence/file/FileEventRepository";

const router = Router();

// Inicialización de repositorios, servicios y controladores
const eventoRepository = new FileEventRepository(); // En esta primera version, usamos repositorios basados en archivos
const eventoService = new EventoService(eventoRepository);
const eventoController = new EventoController(eventoService);

router.post("/", eventoController.crearEvento);
router.get("/", eventoController.listarEventos);
router.get("/:id", eventoController.obtenerEvento);

export default router;
