import { UsuarioEstado } from "./enums/usuarioEstado";
import { UsuarioRol } from "./enums/usuarioRol";

export interface Usuario {
  id: string;
  codigo: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // ISO
  email: string;
  rol: UsuarioRol;
  estado: UsuarioEstado;
  createdAt: string;
  updatedAt: string;
}
