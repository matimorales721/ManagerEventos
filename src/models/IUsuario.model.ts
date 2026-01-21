import { IUsuario } from "../types/Usuario";

export interface IUsuarioModel {
  findByUsername(username: string): Promise<IUsuario | null>;
  findById(id: string): Promise<IUsuario | null>;
  findByEmail(email: string): Promise<IUsuario | null>;
  findAll(): Promise<IUsuario[]>;
  createUser(usuario: IUsuario): Promise<void>;
  update(usuario: IUsuario): Promise<void>;
}
