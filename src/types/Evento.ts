import { EventoEstado } from "../enums/eventoEstado";

export interface IEvento {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  fechaHora: string;   // ISO
  cupoTotal: number;
  imagenUrl?: string;
  estado?: EventoEstado;
  ubicacion: string;
  direccion: string;
  precioLocalidad: number;
  categoriaId: string;
  createdAt: string;
  updatedAt: string;
}
