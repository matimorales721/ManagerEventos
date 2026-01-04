import { Router } from "express";
import { EntradaController } from "../controllers/EntradaController";
import { EntradaService } from "../services/EntradaService";
import { FileTicketRepository } from "../persistence/file/FileTicketRepository";
import { FileEventRepository } from "../persistence/file/FileEventRepository";
import { FileUserRepository } from "../persistence/file/FileUserRepository";
import { MySQLTicketRepository } from "../persistence/db/MySQLTicketRepository";
import { MySQLEventRepository } from "../persistence/db/MySQLEventRepository";
import { MySQLUserRepository } from "../persistence/db/MySQLUserRepository";

const router = Router();

// Inicialización de repositorios, servicios y controladores
// Elige UNO de los siguientes conjuntos de repositorios:

// Opción 1: Repositorios basados en archivos JSON
// const entradaRepository = new FileTicketRepository();
// const eventoRepository = new FileEventRepository();
// const usuarioRepository = new FileUserRepository();

// Opción 2: Repositorios basados en MySQL (descomenta estas líneas y comenta las de arriba)
const entradaRepository = new MySQLTicketRepository();
const eventoRepository = new MySQLEventRepository();
const usuarioRepository = new MySQLUserRepository();

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
