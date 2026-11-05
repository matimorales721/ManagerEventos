import { UsuarioEstado } from "../enums/usuarioEstado";
import { UsuarioRol } from "../enums/usuarioRol";

// Usuario puede ser un admin, un Veterinario, o un asistente. 
export interface IUsuario {
  username: string;
  email: string;
  password: string;
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  rol: UsuarioRol;
  estado: UsuarioEstado;
  createdAt: string;
  updatedAt: string;
}
