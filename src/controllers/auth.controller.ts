import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { validationResult } from 'express-validator';

export const register = async (req: Request, res: Response) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, nombre, apellido, fechaNacimiento } = req.body;
        await authService.register(username, email, password, nombre, apellido, fechaNacimiento);

        return res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error: any) {
        console.error(error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El usuario o email ya existe' });
        }
        return res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const token = await authService.login(email, password);

        return res.json({ token });
    } catch (error: any) {
        console.error(error);
        if (error.message === 'Credenciales inválidas') {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

export const listarUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await authService.listarUsuarios();
    return res.json(usuarios);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Error al listar usuarios" });
  }
};

export const obtenerUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuario = await authService.obtenerUsuario(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.json(usuario);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Error al obtener usuario" });
  }
};