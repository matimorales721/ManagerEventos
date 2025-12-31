import { UsuarioEstado } from "./enums/usuarioEstado";

export interface Usuario {
  id: string;
  codigo: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // ISO
  email: string;
  estado: UsuarioEstado;
  createdAt: string;
  updatedAt: string;
}
