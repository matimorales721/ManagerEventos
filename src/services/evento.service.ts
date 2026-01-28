import { randomUUID } from "crypto";
import { newDate } from "../utils/dateHelper";
import { IEvento } from "../types/Evento";
import { IEntrada } from "../types/Entrada";
import { EventoEstado } from "../enums/eventoEstado";
import { EntradaEstado } from "../enums/entradaEstado";
import { getEntradaModel, getEventoModel } from "../config/ModelFactory";

const eventoModel = getEventoModel();
const entradaModel = getEntradaModel();

interface CreateEventoDTO {
  titulo: string;
  descripcion: string;
  fechaHora: string;   // ISO
  cupoTotal: number;
  imagenUrl?: string;
  ubicacion: string;
  direccion: string;
  precioLocalidad: number;
  categoriaId: string;
}

// Genera un código único para el evento
const generateEventCode = (): string => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EVT-${random}`;
}

const generateId = (): string => randomUUID();

// Creación de un nuevo evento
export const crearEvento = async (data: CreateEventoDTO): Promise<IEvento> => {

  const ahora = newDate();
  const ahoraISO = ahora.toISOString();

  let evento: IEvento = {
    id: '',
    codigo: generateEventCode(),
    titulo: data.titulo,
    descripcion: data.descripcion,
    fechaHora: data.fechaHora,
    cupoTotal: data.cupoTotal,
    imagenUrl: data.imagenUrl,
    ubicacion: data.ubicacion,
    direccion: data.direccion,
    precioLocalidad: data.precioLocalidad,
    categoriaId: data.categoriaId,
    estado: EventoEstado.ACTIVO,
    createdAt: ahoraISO,
    updatedAt: ahoraISO,
  };

  evento.id = await eventoModel.agregarEvento(evento);
  return evento;
}

export const listarEventos = async (): Promise<IEvento[]> => {
  return eventoModel.findAll();
}

export const obtenerEvento = async (id: string): Promise<IEvento | null> => {
  return eventoModel.findById(id);
}

export const calcularLocalidadesOcupadas = async (eventoId: string): Promise<number> => {
  const entradas: IEntrada[] = await entradaModel.findByEventoId(eventoId);
  return entradas
    .filter((e) => e.estado === EntradaEstado.NUEVA || e.estado === EntradaEstado.ACTIVA)
    .reduce((sum, e) => sum + e.cantidadLocalidades, 0);
}

