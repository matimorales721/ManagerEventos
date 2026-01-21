import { EventoEstado } from "../enums/eventoEstado";

export interface IEvento {
  id: string;
  codigo: string;
  nombre: string;
  fechaHora: string;   // ISO
  cupoTotal: number;
  estado?: EventoEstado;
  createdAt: string;
  updatedAt: string;
}
