import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { UsuarioService } from "../services/UsuarioService";
import { FileUserRepository } from "../persistence/file/FileUserRepository";

const router = Router();

// Inicialización de repositorios, servicios y controladores
const usuarioRepository = new FileUserRepository(); // En esta primera version, usamos repositorios basados en archivos
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

router.post("/", usuarioController.crearUsuario);
router.get("/", usuarioController.listarUsuarios);
router.get("/:id", usuarioController.obtenerUsuario);

export default router;
