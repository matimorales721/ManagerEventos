import { Evento } from "../models/Evento";

export interface EventoRepository {
  findById(id: string): Promise<Evento | null>;
  findAll(): Promise<Evento[]>;
  save(evento: Evento): Promise<void>;
  update(evento: Evento): Promise<void>;
}
