import { Router } from "express";
import * as entradaController from "../controllers/entrada.controller";
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UsuarioRol } from "../enums/usuarioRol";

const router = Router();

router.post("/buscar", authenticate, entradaController.buscarEntrada); // authenticate
router.post("/reservar", authenticate, entradaController.reservarEntrada); // authenticate
router.post("/pagar/:id", authenticate, entradaController.pagarEntrada); // authenticate
router.post("/validar/:codigo", authenticate, authorize([UsuarioRol.ADMIN]), entradaController.validarEntrada); // authenticate y authorize([UsuarioRol.ADMIN])
router.post("/cancelar-vencidas", authenticate, authorize([UsuarioRol.ADMIN]), entradaController.cancelarVencidas); // authenticate y authorize([UsuarioRol.ADMIN])

router.get("/", authenticate, entradaController.listarEntradas); // authenticate
router.get("/:id", authenticate, entradaController.obtenerEntrada); // authenticate

export default router;
