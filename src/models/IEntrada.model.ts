import { IEntrada } from "../types/Entrada";

export interface IEntradaModel {
  findById(id: string): Promise<IEntrada | null>;
  findByCodigo(codigo: string): Promise<IEntrada | null>;
  findAll(): Promise<IEntrada[]>;
  findByEventoId(eventoId: string): Promise<IEntrada[]>;
  findByUsuarioId(usuarioId: string): Promise<IEntrada[]>;
  save(entrada: IEntrada): Promise<string>;
  update(entrada: IEntrada): Promise<void>;
}
