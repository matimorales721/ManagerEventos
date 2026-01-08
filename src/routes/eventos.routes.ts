import { Router } from "express";
import * as eventoController from "../controllers/evento.controller";

const router = Router();

router.post("/", eventoController.crearEvento);
router.get("/", eventoController.listarEventos);
router.get("/:id", eventoController.obtenerEvento);

export default router;
