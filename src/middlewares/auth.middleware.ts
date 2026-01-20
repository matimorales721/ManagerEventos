import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth';
import { UsuarioRol } from '../enums/usuarioRol';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticateOrNot = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // Buscar token en cookies
  let token = '';
  if (req.cookies) {
    token = req.cookies.token;
  } else {
    return next(); // No autenticado, continuar sin user
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(); // Token inválido, continuar sin user
    }
    req.user = decoded as JwtPayload;
    next();
  }
  );
};

/**
 * Middleware de autenticación
 *
 * Verifica que el token sea válido y lo almacena en req.user
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Buscar token en cookies
  let token = '';
  if (req.cookies) {
    token = req.cookies.token;
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token or expired' });
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

/**
 * Middleware de autorización
 *
 * Verifica que el usuario tenga uno de los roles permitidos
 */
export const authorize = (roles: Array<UsuarioRol>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado. Tienes que ser administrador.' });
    }
    next();
  };
};