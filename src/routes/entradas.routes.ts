import { Router } from "express";
import * as entradaController from "../controllers/entrada.controller";
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post("/reservar", entradaController.reservarEntrada); // authenticate
router.post("/pagar/:id", entradaController.pagarEntrada); // authenticate
router.post("/validar/:codigo", entradaController.validarEntrada); // authenticate y authorize([UsuarioRol.ADMIN])
router.post("/cancelar-vencidas", entradaController.cancelarVencidas); // authenticate y authorize([UsuarioRol.ADMIN])

router.get("/", entradaController.listarEntradas); // authenticate
router.get("/:id", entradaController.obtenerEntrada); // authenticate

export default router;
