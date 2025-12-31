import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";

export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  crearUsuario = async (req: Request, res: Response) => {
    try {
      const { nombre, apellido, fechaNacimiento, email } = req.body;

      if (!nombre || !apellido || !fechaNacimiento || !email) {
        return res.status(400).json({ message: "Datos inválidos" });
      }

      const usuario = await this.usuarioService.crearUsuario({
        nombre,
        apellido,
        fechaNacimiento,
        email,
      });

      return res.status(201).json(usuario);
    } catch (err: any) {
      console.error(err);
      return res.status(400).json({ message: err.message || "Error al crear usuario" });
    }
  };

  listarUsuarios = async (_req: Request, res: Response) => {
    try {
      const usuarios = await this.usuarioService.listarUsuarios();
      return res.json(usuarios);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Error al listar usuarios" });
    }
  };

  obtenerUsuario = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const usuario = await this.usuarioService.obtenerUsuario(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      return res.json(usuario);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Error al obtener usuario" });
    }
  };
}
