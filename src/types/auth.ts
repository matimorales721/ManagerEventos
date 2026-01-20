import { UsuarioRol } from "../models/enums/usuarioRol";

export interface JwtPayload {
    id: string;
    role: UsuarioRol;
    username: string;
}