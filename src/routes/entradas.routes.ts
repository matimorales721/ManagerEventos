import { Router } from "express";
import * as entradaController from "../controllers/entrada.controller";
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UsuarioRol } from "../enums/usuarioRol";

const router = Router();

router.post("/buscar", authenticate, entradaController.buscarEntrada);
router.post("/reservar", authenticate, entradaController.reservarEntrada); // validaciones
router.post("/pagar/:id", authenticate, entradaController.pagarEntrada); // validaciones
router.post("/validar/:codigo", authenticate, authorize([UsuarioRol.ADMIN]), entradaController.validarEntrada); // validaciones
router.post("/cancelar-vencidas", authenticate, authorize([UsuarioRol.ADMIN]), entradaController.cancelarVencidas); // validaciones

router.get("/", authenticate, entradaController.listarEntradas); // validaciones
router.get("/:id", authenticate, entradaController.obtenerEntrada); // validaciones

export default router;
