import { IEvento } from "../types/Evento";

export interface IEventoModel {
  findById(id: string): Promise<IEvento | null>;
  findAll(): Promise<IEvento[]>;
  agregarEvento(evento: IEvento): Promise<void>;
  update(evento: IEvento): Promise<void>;
}
