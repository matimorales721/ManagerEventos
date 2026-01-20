import { UsuarioRol } from "../enums/usuarioRol";

export interface JwtPayload {
    id: string;
    role: UsuarioRol;
    username: string;
}