import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { UsuarioService } from "../services/UsuarioService";
import { FileUserRepository } from "../persistence/file/FileUserRepository";
import { MySQLUserRepository } from "../persistence/db/MySQLUserRepository";

const router = Router();

// Inicialización de repositorios, servicios y controladores
// Elige UNO de los siguientes repositorios:
const usuarioRepository = new FileUserRepository();  // Repositorio basado en archivos JSON
// const usuarioRepository = new MySQLUserRepository();  // Repositorio basado en MySQL

const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

router.post("/", usuarioController.crearUsuario);
router.get("/", usuarioController.listarUsuarios);
router.get("/:id", usuarioController.obtenerUsuario);

export default router;
