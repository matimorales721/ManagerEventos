import { Router } from "express";
import { EntradaController } from "../controllers/EntradaController";
import { EntradaService } from "../services/EntradaService";
import { FileTicketRepository } from "../persistence/file/FileTicketRepository";
import { FileEventRepository } from "../persistence/file/FileEventRepository";
import { FileUserRepository } from "../persistence/file/FileUserRepository";

const router = Router();

// Inicialización de repositorios, servicios y controladores
// En esta primera version, usamos repositorios basados en archivos
const entradaRepository = new FileTicketRepository();
const eventoRepository = new FileEventRepository();
const usuarioRepository = new FileUserRepository();

const entradaService = new EntradaService(
  entradaRepository,
  eventoRepository,
  usuarioRepository
);
const entradaController = new EntradaController(entradaService);

router.post("/reservar", entradaController.reservarEntrada);
router.post("/pagar/:id", entradaController.pagarEntrada);
router.post("/validar/:codigo", entradaController.validarEntrada);
router.post("/cancelar-vencidas", entradaController.cancelarVencidas);

router.get("/", entradaController.listarEntradas);
router.get("/:id", entradaController.obtenerEntrada);

export default router;
