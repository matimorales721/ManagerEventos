import { Entrada } from "../models/Entrada";
import { EntradaEstado } from "../models/enums/entradaEstado";

import { getEntradaRepository, getEventoRepository, getUsuarioRepository } from "../config/RepositoryFactory";

import { EventoEstado } from "../models/enums/eventoEstado";
import { UsuarioEstado } from "../models/enums/usuarioEstado";
import { randomUUID } from "crypto";
import { newDate } from "../utils/dateHelper";

const entradaRepository = getEntradaRepository();
const eventoRepository = getEventoRepository();
const usuarioRepository = getUsuarioRepository();

interface ReservarEntradaDTO {
  eventoId: string;
  usuarioId: string;
  cantidadLocalidades: number;
}

// Genera un código único para la entrada
export const generateTicketCode = (): string => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ENT-${random}`;
}

export const calcularLocalidadesOcupadas = async (eventoId: string): Promise<number> => {
  const entradas = await entradaRepository.findByEventoId(eventoId);
  return entradas
    .filter((e) => e.estado === EntradaEstado.NUEVA || e.estado === EntradaEstado.ACTIVA)
    .reduce((sum, e) => sum + e.cantidadLocalidades, 0);
}

export const listarEntradas = async (): Promise<Entrada[]> => {
  return entradaRepository.findAll();
}

export const obtenerEntrada = async (id: string): Promise<Entrada | null> => {
  return entradaRepository.findById(id);
}

export const obtenerEntradaPorCodigo = async (codigo: string): Promise<Entrada | null> => {
  return entradaRepository.findByCodigo(codigo);
}

export const listarEntradasPorUsuario = async (usuarioId: string): Promise<Entrada[]> => {
  return entradaRepository.findByUsuarioId(usuarioId);
}

const generateId = (): string => randomUUID();

// Reserva de entradas
export const reservarEntrada = async (data: ReservarEntradaDTO): Promise<Entrada> => {

  //console.log("Reservando entrada con datos:", data);
  const evento = await eventoRepository.findById(data.eventoId);

  if (!evento) {
    throw new Error("Evento no encontrado");
  }
  if (evento.estado !== EventoEstado.ACTIVO) {
    throw new Error("El evento no está activo");
  }

  const ahora = newDate();
  const ahoraISO = ahora.toISOString();

  // lo comento para probar más fácilmente
  // la Certificacion de Entradas debe comenzar cantidadHorasAntes del evento
  /*const cantidadHorasAntes = 5;
  const fechaInicioCertificacionEntradas = new Date(new Date(evento.fechaHora).getTime() - cantidadHorasAntes * 60 * 60 * 1000);
  if (fechaInicioCertificacionEntradas <= ahora) {
    throw new Error("El evento ya ocurrió o está en curso; no se pueden reservar entradas");
  }*/

  const usuario = await usuarioRepository.findById(data.usuarioId);
  if (!usuario || usuario.estado !== UsuarioEstado.ACTIVO) {
    throw new Error("Usuario no válido");
  }

  if (data.cantidadLocalidades <= 0) {
    throw new Error("La cantidad de localidades debe ser mayor a cero");
  }

  const ocupadas = await calcularLocalidadesOcupadas(evento.id);
  const disponibles = evento.cupoTotal - ocupadas;

  if (data.cantidadLocalidades > disponibles) {
    throw new Error(
      `No hay suficientes localidades disponibles. Quedan ${disponibles} lugares.`
    );
  }



  const entrada: Entrada = {
    id: generateId(),
    codigo: generateTicketCode(),
    eventoId: evento.id,
    usuarioId: usuario.id,
    cantidadLocalidades: data.cantidadLocalidades,
    estado: EntradaEstado.NUEVA,
    fechaReserva: ahoraISO,
    createdAt: ahoraISO,
    updatedAt: ahoraISO,
  };

  await entradaRepository.save(entrada);
  //console.log("Entrada reservada:", entrada);
  return entrada;
}

// Pago de entradas
export const pagarEntrada = async (id: string): Promise<Entrada> => {

  const entrada = await entradaRepository.findById(id);

  if (!entrada) {
    throw new Error("Entrada no encontrada");
  }

  if (entrada.estado !== EntradaEstado.NUEVA) {
    throw new Error("Solo se pueden pagar entradas en estado NUEVA");
  }

  const evento = await eventoRepository.findById(entrada.eventoId);

  if (!evento) {
    throw new Error("Evento no encontrado");
  }
  if (evento.estado !== EventoEstado.ACTIVO) {
    throw new Error("El evento no está activo");
  }

  const ahora = newDate();
  const ahoraISO = ahora.toISOString();

  /*const fechaEvento = new Date(evento.fechaHora);
  if (fechaEvento <= ahora) {
    throw new Error("El evento ya ocurrió o está en curso; no se puede pagar la entrada");
  }*/

  // pago simulado
  entrada.estado = EntradaEstado.ACTIVA;
  entrada.fechaPago = ahoraISO;
  entrada.updatedAt = entrada.fechaPago;

  await entradaRepository.update(entrada);
  return entrada;
}

// Validación de entradas
export const validarEntrada = async (codigo: string): Promise<Entrada> => {
  const entrada = await entradaRepository.findByCodigo(codigo);
  if (!entrada) {
    throw new Error("Entrada no encontrada");
  }

  if (entrada.estado !== EntradaEstado.ACTIVA) {
    throw new Error("Solo se pueden validar entradas en estado ACTIVA");
  }

  const evento = await eventoRepository.findById(entrada.eventoId);
  if (!evento) {
    throw new Error("Evento no encontrado");
  }

  const ahora = newDate();
  const ahoraISO = ahora.toISOString();

  const fechaEvento = new Date(evento.fechaHora);

  // Permito validar solo si ya es el día del evento (o después) y no está cancelado
  if (evento.estado === EventoEstado.CANCELADO) {
    throw new Error("El evento está cancelado");
  }

  // la Certificacion de Entradas debe comenzar cantidadHorasAntes del evento
  /*const cantidadHorasAntes = 5;
  const fechaInicioCertificacionEntradas = new Date(fechaEvento.getTime() - cantidadHorasAntes * 60 * 60 * 1000);
  
  if (ahora < fechaInicioCertificacionEntradas) {
    throw new Error("El evento todavía no comenzó, aún no se puede validar la entrada");
  }*/

  entrada.estado = EntradaEstado.UTILIZADA;
  entrada.fechaUso = ahoraISO;
  entrada.updatedAt = entrada.fechaUso;

  await entradaRepository.update(entrada);
  return entrada;
}

// Cancelación de entradas vencidas y finalizar eventos terminados
export const cancelarEntradasVencidas = async (): Promise<{ entradasCanceladasPorReserva: number; entradasCanceladasPorEvento: number; eventosFinalizados: number }> => {
  const todas = await entradaRepository.findAll();

  let entradasCanceladasPorReserva = 0;
  let entradasCanceladasPorEvento = 0;
  let eventosFinalizados = 0;

  for (const entrada of todas) {

    const evento = await eventoRepository.findById(entrada.eventoId);
    if (!evento) continue;

    const ahora = newDate();
    const ahoraISO = ahora.toISOString();

    const fechaEvento = new Date(evento.fechaHora);
    const fechaReserva = new Date(entrada.fechaReserva);

    // 1) Reservas NUEVA que vencen a 1 día sin pagar
    if (entrada.estado === EntradaEstado.NUEVA) {
      const vencimientoReserva = new Date(fechaReserva.getTime() + 24 * 60 * 60 * 1000);
      if (vencimientoReserva < ahora) {
        entrada.estado = EntradaEstado.CANCELADA;
        entrada.updatedAt = ahoraISO;
        await entradaRepository.update(entrada);
        entradasCanceladasPorReserva++;
        continue;
      }
    }

    // 2) Entradas NUEVA o ACTIVA cuyo evento ya pasó → CANCELADA
    if (
      (entrada.estado === EntradaEstado.NUEVA || entrada.estado === EntradaEstado.ACTIVA) &&
      fechaEvento < ahora
    ) {
      entrada.estado = EntradaEstado.CANCELADA;
      entrada.updatedAt = ahoraISO;
      await entradaRepository.update(entrada);
      entradasCanceladasPorEvento++;
    }
  }

  const ahora = newDate();
  const ahoraISO = ahora.toISOString();

  // Extra: actualizar estado de eventos que ya pasaron (Activo -> Finalizado)
  const eventos = (await eventoRepository.findAll()).filter(e => e.estado === EventoEstado.ACTIVO);
  for (const evento of eventos) {
    const fechaEvento = new Date(evento.fechaHora);
    const duracion = 2; // horas // IDEA esto podria ser un campo del evento
    const fechaEventoMasDuracion = new Date(fechaEvento.getTime() + duracion * 60 * 60 * 1000);

    if (evento.estado === EventoEstado.ACTIVO && fechaEventoMasDuracion < ahora) {
      evento.estado = EventoEstado.FINALIZADO;
      evento.updatedAt = ahoraISO;
      await eventoRepository.update(evento);
      eventosFinalizados++;
    }
  }

  // Lo ideal sería un MaintenanceService, pero para simplificar podemos dejarlo para después.

  return { entradasCanceladasPorReserva, entradasCanceladasPorEvento, eventosFinalizados };
}

