import { Router } from "express";
import * as usuarioController from "../controllers/usuario.controller";

const router = Router();

router.post("/", usuarioController.crearUsuario);
router.get("/", usuarioController.listarUsuarios);
router.get("/:id", usuarioController.obtenerUsuario);

export default router;
