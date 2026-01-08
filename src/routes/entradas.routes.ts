import { Router } from "express";
import * as entradaController from "../controllers/entrada.controller";

const router = Router();

router.post("/reservar", entradaController.reservarEntrada);
router.post("/pagar/:id", entradaController.pagarEntrada);
router.post("/validar/:codigo", entradaController.validarEntrada);
router.post("/cancelar-vencidas", entradaController.cancelarVencidas);

router.get("/", entradaController.listarEntradas);
router.get("/:id", entradaController.obtenerEntrada);

export default router;
