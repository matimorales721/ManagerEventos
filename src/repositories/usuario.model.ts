import { Usuario } from "../models/Usuario";

export interface UsuarioRepository {
  findByUsername(username: string): Promise<Usuario | null>;
  findById(id: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  findAll(): Promise<Usuario[]>;
  createUser(usuario: Usuario): Promise<void>;
  update(usuario: Usuario): Promise<void>;
}
