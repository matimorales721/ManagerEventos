import { EntradaEstado } from "./enums/entradaEstado";

export interface Entrada {
  id: string;
  codigo: string;
  eventoId: string;
  usuarioId: string;
  cantidadLocalidades: number;
  estado: EntradaEstado;
  fechaReserva: string;   // cuándo se reservó
  fechaPago?: string;     // cuándo se pagó
  fechaUso?: string;      // cuándo se validó
  createdAt: string;
  updatedAt: string;
}