import { Entrada } from "../models/Entrada";

export interface EntradaRepository {
  findById(id: string): Promise<Entrada | null>;
  findByCodigo(codigo: string): Promise<Entrada | null>;
  findAll(): Promise<Entrada[]>;
  findByEventoId(eventoId: string): Promise<Entrada[]>;
  findByUsuarioId(usuarioId: string): Promise<Entrada[]>;
  save(entrada: Entrada): Promise<void>;
  update(entrada: Entrada): Promise<void>;
}
