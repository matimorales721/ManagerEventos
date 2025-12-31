import { Usuario } from "../models/Usuario";

export interface UsuarioRepository {
  findById(id: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  findAll(): Promise<Usuario[]>;
  save(usuario: Usuario): Promise<void>;
  update(usuario: Usuario): Promise<void>;
}
