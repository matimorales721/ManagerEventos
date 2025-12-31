import { EventoEstado } from "./enums/eventoEstado";

export interface Evento {
  id: string;
  codigo: string;
  nombre: string;
  fechaHora: string;   // ISO
  cupoTotal: number;
  estado: EventoEstado;
  createdAt: string;
  updatedAt: string;
}
