import { randomUUID } from "crypto";
import { Evento } from "../models/Evento";
import { EventoEstado } from "../models/enums/eventoEstado";
import { getEventoRepository } from "../config/RepositoryFactory";
import { newDate } from "../utils/dateHelper";

const eventoRepository = getEventoRepository();

interface CreateEventoDTO {
  nombre: string;
  fechaHora: string;   // ISO
  cupoTotal: number;
}

// Genera un código único para el evento
const generateEventCode = (): string => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EVT-${random}`;
}

const generateId = (): string => randomUUID();

// Creación de un nuevo evento
export const crearEvento = async (data: CreateEventoDTO): Promise<Evento> => {

  const ahora = newDate();
  const ahoraISO = ahora.toISOString();

  const evento: Evento = {
    id: generateId(),
    codigo: generateEventCode(),
    nombre: data.nombre,
    fechaHora: data.fechaHora,
    cupoTotal: data.cupoTotal,
    estado: EventoEstado.ACTIVO,
    createdAt: ahoraISO,
    updatedAt: ahoraISO,
  };

  await eventoRepository.agregarEvento(evento);
  return evento;
}

export const listarEventos = async (): Promise<Evento[]> => {
  return eventoRepository.findAll();
}

export const obtenerEvento = async (id: string): Promise<Evento | null> => {
  return eventoRepository.findById(id);
}

