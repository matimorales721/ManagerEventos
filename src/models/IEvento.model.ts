import { Evento } from "../types/Evento";

export interface IEventoModel {
  findById(id: string): Promise<Evento | null>;
  findAll(): Promise<Evento[]>;
  agregarEvento(evento: Evento): Promise<void>;
  update(evento: Evento): Promise<void>;
}
