import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Evento } from "../../models/Evento";
import { EventoRepository } from "../../repositories/evento.model";
import pool from "./mysql";
import { EventoEstado } from "../../models/enums/eventoEstado";

export type EventoRow = RowDataPacket & Evento;

export const findById = async (id: string): Promise<Evento | null> => {
  const [rows] = await pool.query<EventoRow[]>(
    "SELECT id, codigo, nombre, fechaHora, cupoTotal, est.descripcion estado, createdAt, updatedAt FROM Eventos e join EventoEstados est on est.idEstado = e.idEstado  WHERE id = ?",
    [id]
  );

  if (rows.length === 0) return null;
  return rows[0];
}

export const findAll = async (): Promise<Evento[]> => {
  const [rows] = await pool.query<EventoRow[]>(
    "SELECT id, codigo, nombre, fechaHora, cupoTotal, est.descripcion estado, createdAt, updatedAt FROM Eventos e join EventoEstados est on est.idEstado = e.idEstado ORDER BY fechaHora DESC"
  );

  return rows;
}

export const agregarEvento = async (evento: Evento): Promise<void> => {

  switch (evento.estado) {
    case EventoEstado.ACTIVO:
      var idEstado = 1;
      break;
    case EventoEstado.CANCELADO:
      var idEstado = 2;
      break;
    case EventoEstado.FINALIZADO:
      var idEstado = 3;
      break;
    default:
      throw new Error("Estado de evento inválido");
  }


  await pool.query<ResultSetHeader>(
    `INSERT INTO Eventos 
            (id, codigo, nombre, fechaHora, cupoTotal, idEstado, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      evento.id,
      evento.codigo,
      evento.nombre,
      new Date(evento.fechaHora),
      evento.cupoTotal,
      idEstado,
      new Date(evento.createdAt),
      new Date(evento.updatedAt),
    ]
  );
}

export const update = async (evento: Evento): Promise<void> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE Eventos 
       SET codigo = ?, nombre = ?, fechaHora = ?, cupoTotal = ?, 
           estado = ?, updatedAt = ? 
       WHERE id = ?`,
    [
      evento.codigo,
      evento.nombre,
      new Date(evento.fechaHora),
      evento.cupoTotal,
      evento.estado,
      new Date(evento.updatedAt),
      evento.id,
    ]
  );

  if (result.affectedRows === 0) {
    throw new Error("Evento no encontrado");
  }
}
