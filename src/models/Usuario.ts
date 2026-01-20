import { UsuarioEstado } from "./enums/usuarioEstado";
import { UsuarioRol } from "./enums/usuarioRol";

export interface Usuario {
  username: string;
  email: string;
  password: string;
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // ISO
  rol?: UsuarioRol;
  estado: UsuarioEstado;
  createdAt: string;
  updatedAt: string;
}
