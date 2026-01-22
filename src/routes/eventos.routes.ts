import { Router } from "express";
import * as eventoController from "../controllers/evento.controller";
import { validateEvento } from "../validators/eventos.validators";
import { uploadEvento } from "../middlewares/upload.middleware";

const router = Router();

router.post("/", uploadEvento.single('imagen'), validateEvento, eventoController.crearEvento);
router.get("/", eventoController.listarEventos);
router.get("/:id", eventoController.obtenerEvento);

export default router;
