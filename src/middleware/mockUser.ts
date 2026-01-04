import { Request, Response, NextFunction } from "express";
import { Usuario } from "../models/Usuario";
import { UsuarioEstado } from "../models/enums/usuarioEstado";
import { UsuarioRol } from "../models/enums/usuarioRol";

// Extend Express Session to include isAdmin
declare module 'express-session' {
    interface SessionData {
        isAdmin?: boolean;
    }
}

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: Usuario;
        }
    }
}

// Usuario mockeado normal
const mockNormalUser: Usuario = {
    id: "c4a77a7f-0b9d-4309-83e9-1fba79246083",
    codigo: "USR-NRG3KG",
    nombre: "Juan",
    apellido: "Pérez",
    fechaNacimiento: "1990-05-15",
    email: "juan.perez@example.com",
    rol: UsuarioRol.NORMAL,
    estado: UsuarioEstado.ACTIVO,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

// Usuario mockeado administrador
const mockAdminUser: Usuario = {
    id: "a58d6f81-7502-464e-be2c-144c9a8df4ab",
    codigo: "USR-ADMIN1",
    nombre: "Admin",
    apellido: "Sistema",
    fechaNacimiento: "1985-01-01",
    email: "admin@example.com",
    rol: UsuarioRol.ADMIN,
    estado: UsuarioEstado.ACTIVO,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Si viene el parámetro admin, actualizar la sesión
    if (req.query.admin === 'true') {
        req.session.isAdmin = true;
    } else if (req.query.admin === 'false') {
        req.session.isAdmin = false;
    }

    // Usar el valor de la sesión o por defecto usuario normal
    if (req.session.isAdmin) {
        req.user = mockAdminUser;
    } else {
        req.user = mockNormalUser;
    }

    next();
};
