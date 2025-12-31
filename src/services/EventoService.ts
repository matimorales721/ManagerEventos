import { randomUUID } from "crypto";
import { Evento } from "../models/Evento";
import { EventoEstado } from "../models/enums/eventoEstado";
import { EventoRepository } from "../repositories/EventoRepository";
import { newDate } from "../utils/dateHelper";

interface CreateEventoDTO {
  nombre: string;
  fechaHora: string;   // ISO
  cupoTotal: number;
}

export class EventoService {
  constructor(private eventoRepository: EventoRepository) {}

  // Genera un código único para el evento
  private generateEventCode(): string {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `EVT-${random}`;
  }

  private generateId = (): string => randomUUID();

  // Creación de un nuevo evento
  async crearEvento(data: CreateEventoDTO): Promise<Evento> {
    
    const ahora = newDate();
    const ahoraISO = ahora.toISOString();

    const evento: Evento = {
      id: this.generateId(),
      codigo: this.generateEventCode(),
      nombre: data.nombre,
      fechaHora: data.fechaHora,
      cupoTotal: data.cupoTotal,
      estado: EventoEstado.ACTIVO,
      createdAt: ahoraISO,
      updatedAt: ahoraISO,
    };

    await this.eventoRepository.save(evento);
    return evento;
  }

  async listarEventos(): Promise<Evento[]> {
    return this.eventoRepository.findAll();
  }

  async obtenerEvento(id: string): Promise<Evento | null> {
    return this.eventoRepository.findById(id);
  }
}
