import { Entrada } from "../models/Entrada";
import { EntradaEstado } from "../models/enums/entradaEstado";
import { EntradaRepository } from "../repositories/EntradaRepository";
import { EventoRepository } from "../repositories/EventoRepository";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { EventoEstado } from "../models/enums/eventoEstado";
import { UsuarioEstado } from "../models/enums/usuarioEstado";
import { randomUUID } from "crypto";

interface ReservarEntradaDTO {
  eventoId: string;
  usuarioId: string;
  cantidadLocalidades: number;
}

export class EntradaService {
  constructor(
    private entradaRepository: EntradaRepository,
    private eventoRepository: EventoRepository,
    private usuarioRepository: UsuarioRepository
  ) {}

  // Genera un código único para la entrada
  private generateTicketCode(): string {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ENT-${random}`;
  }

  // Esta funcion no la entiendo...
  private async calcularLocalidadesOcupadas(eventoId: string): Promise<number> {
    const entradas = await this.entradaRepository.findByEventoId(eventoId);
    return entradas
      .filter((e) => e.estado === EntradaEstado.NUEVA || e.estado === EntradaEstado.ACTIVA)
      .reduce((sum, e) => sum + e.cantidadLocalidades, 0);
  }

  async listarEntradas(): Promise<Entrada[]> {
    return this.entradaRepository.findAll();
  }

  async obtenerEntrada(id: string): Promise<Entrada | null> {
    return this.entradaRepository.findById(id);
  }

  private generateId = (): string => randomUUID();

  // Reserva de entradas
  async reservarEntrada(data: ReservarEntradaDTO): Promise<Entrada> {
    const evento = await this.eventoRepository.findById(data.eventoId);
    if (!evento) {
      throw new Error("Evento no encontrado");
    }
    if (evento.estado !== EventoEstado.ACTIVO) {
      throw new Error("El evento no está activo");
    }

    const ahora = new Date();

    // la Certificacion de Entradas debe comenzar cantidadHorasAntes del evento
    const cantidadHorasAntes = 5;
    const fechaInicioCertificacionEntradas = new Date(new Date(evento.fechaHora).getTime() - cantidadHorasAntes * 60 * 60 * 1000);
    if (fechaInicioCertificacionEntradas <= ahora) {
      throw new Error("El evento ya ocurrió o está en curso; no se pueden reservar entradas");
    }

    const usuario = await this.usuarioRepository.findById(data.usuarioId);
    if (!usuario || usuario.estado !== UsuarioEstado.ACTIVO) {
      throw new Error("Usuario no válido");
    }

    if (data.cantidadLocalidades <= 0) {
      throw new Error("La cantidad de localidades debe ser mayor a cero");
    }

    const ocupadas = await this.calcularLocalidadesOcupadas(evento.id);
    const disponibles = evento.cupoTotal - ocupadas;

    if (data.cantidadLocalidades > disponibles) {
      throw new Error(
        `No hay suficientes localidades disponibles. Quedan ${disponibles} lugares.`
      );
    }

    const nowIso = ahora.toISOString();

    const entrada: Entrada = {
      id: this.generateId(),
      codigo: this.generateTicketCode(),
      eventoId: evento.id,
      usuarioId: usuario.id,
      cantidadLocalidades: data.cantidadLocalidades,
      estado: EntradaEstado.NUEVA,
      fechaReserva: nowIso,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await this.entradaRepository.save(entrada);
    return entrada;
  }

  // Pago de entradas
  async pagarEntrada(id: string): Promise<Entrada> {
    const entrada = await this.entradaRepository.findById(id);
    if (!entrada) {
      throw new Error("Entrada no encontrada");
    }

    if (entrada.estado !== EntradaEstado.NUEVA) {
      throw new Error("Solo se pueden pagar entradas en estado NUEVA");
    }

    const evento = await this.eventoRepository.findById(entrada.eventoId);
    if (!evento) {
      throw new Error("Evento no encontrado");
    }
    if (evento.estado !== EventoEstado.ACTIVO) {
      throw new Error("El evento no está activo");
    }

    const ahora = new Date();
    const fechaEvento = new Date(evento.fechaHora);
    if (fechaEvento <= ahora) {
      throw new Error("El evento ya ocurrió o está en curso; no se puede pagar la entrada");
    }

    // pago simulado
    entrada.estado = EntradaEstado.ACTIVA;
    entrada.fechaPago = ahora.toISOString();
    entrada.updatedAt = entrada.fechaPago;

    await this.entradaRepository.update(entrada);
    return entrada;
  }

  // Validación de entradas
  async validarEntradaPorCodigo(codigo: string): Promise<Entrada> {
    const entrada = await this.entradaRepository.findByCodigo(codigo);
    if (!entrada) {
      throw new Error("Entrada no encontrada");
    }

    if (entrada.estado !== EntradaEstado.ACTIVA) {
      throw new Error("Solo se pueden validar entradas en estado ACTIVA");
    }

    const evento = await this.eventoRepository.findById(entrada.eventoId);
    if (!evento) {
      throw new Error("Evento no encontrado");
    }

    const ahora = new Date();
    const fechaEvento = new Date(evento.fechaHora);

    // Permito validar solo si ya es el día del evento (o después) y no está cancelado
    if (evento.estado === EventoEstado.CANCELADO) {
      throw new Error("El evento está cancelado");
    }

    // la Certificacion de Entradas debe comenzar cantidadHorasAntes del evento
    const cantidadHorasAntes = 5;
    const fechaInicioCertificacionEntradas = new Date(fechaEvento.getTime() - cantidadHorasAntes * 60 * 60 * 1000);
    
    if (ahora < fechaInicioCertificacionEntradas) {
      throw new Error("El evento todavía no comenzó, aún no se puede validar la entrada");
    }

    entrada.estado = EntradaEstado.UTILIZADA;
    entrada.fechaUso = ahora.toISOString();
    entrada.updatedAt = entrada.fechaUso;

    await this.entradaRepository.update(entrada);
    return entrada;
  }

  // Cancelación de entradas vencidas
  async cancelarEntradasVencidas(): Promise<{ canceladasPorReserva: number; canceladasPorEvento: number }> {
    const todas = await this.entradaRepository.findAll();
    const ahora = new Date();

    let canceladasPorReserva = 0;
    let canceladasPorEvento = 0;

    for (const entrada of todas) {
      const evento = await this.eventoRepository.findById(entrada.eventoId);
      if (!evento) continue;

      const fechaEvento = new Date(evento.fechaHora);
      const fechaReserva = new Date(entrada.fechaReserva);

      // 1) Reservas NUEVA que vencen a 1 día sin pagar
      if (entrada.estado === EntradaEstado.NUEVA) {
        const vencimientoReserva = new Date(fechaReserva.getTime() + 24 * 60 * 60 * 1000);
        if (vencimientoReserva < ahora) {
          entrada.estado = EntradaEstado.CANCELADA;
          entrada.updatedAt = ahora.toISOString();
          await this.entradaRepository.update(entrada);
          canceladasPorReserva++;
          continue;
        }
      }

      // 2) Entradas NUEVA o ACTIVA cuyo evento ya pasó → CANCELADA
      if (
        (entrada.estado === EntradaEstado.NUEVA || entrada.estado === EntradaEstado.ACTIVA) &&
        fechaEvento < ahora
      ) {
        entrada.estado = EntradaEstado.CANCELADA;
        entrada.updatedAt = ahora.toISOString();
        await this.entradaRepository.update(entrada);
        canceladasPorEvento++;
      }
    }

    // Extra: actualizar estado de eventos que ya pasaron (Activo -> Finalizado)
    // Lo ideal sería un MaintenanceService, pero para simplificar podemos dejarlo para después.

    return { canceladasPorReserva, canceladasPorEvento };
  }
}
