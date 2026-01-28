import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { IEvento } from "../../../types/Evento";
import pool from "./mysql";
import { EventoEstado } from "../../../enums/eventoEstado";

export type EventoRow = RowDataPacket & IEvento;

export const findById = async (id: string): Promise<IEvento | null> => {
  const [rows] = await pool.query<EventoRow[]>(
    "SELECT id, codigo, titulo, descripcion, fechaHora, cupoTotal, imagenUrl, ubicacion, direccion, precioLocalidad, categoriaId, est.descripcion estado, createdAt, updatedAt FROM Eventos e join EventoEstados est on est.idEstado = e.idEstado  WHERE id = ?",
    [id]
  );

  if (rows.length === 0) return null;
  return rows[0];
}

export const findAll = async (): Promise<IEvento[]> => {
  const [rows] = await pool.query<EventoRow[]>(
    "SELECT id, codigo, titulo, descripcion, fechaHora, cupoTotal, imagenUrl, ubicacion, direccion, precioLocalidad, categoriaId, est.descripcion estado, createdAt, updatedAt FROM Eventos e join EventoEstados est on est.idEstado = e.idEstado ORDER BY fechaHora DESC"
  );

  return rows;
}

export const agregarEvento = async (evento: IEvento): Promise<void> => {

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
            (id, codigo, titulo, descripcion, fechaHora, cupoTotal, imagenUrl, ubicacion, direccion, precioLocalidad, categoriaId, idEstado, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      evento.id,
      evento.codigo,
      evento.titulo,
      evento.descripcion,
      new Date(evento.fechaHora),
      evento.cupoTotal,
      evento.imagenUrl,
      evento.ubicacion,
      evento.direccion,
      evento.precioLocalidad,
      evento.categoriaId,
      idEstado,
      new Date(evento.createdAt),
      new Date(evento.updatedAt),
    ]
  );
}

export const update = async (evento: IEvento): Promise<void> => {

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

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE Eventos 
       SET codigo = ?, titulo = ?, descripcion = ?, fechaHora = ?, cupoTotal = ?, 
           imagenUrl = ?, ubicacion = ?, direccion = ?, precioLocalidad = ?, categoriaId = ?, idEstado = ?, updatedAt = ? 
       WHERE id = ?`,
    [
      evento.codigo,
      evento.titulo,
      evento.descripcion,
      new Date(evento.fechaHora),
      evento.cupoTotal,
      evento.imagenUrl,
      evento.ubicacion,
      evento.direccion,
      evento.precioLocalidad,
      evento.categoriaId,
      idEstado,
      new Date(evento.updatedAt),
      evento.id,
    ]
  );

  if (result.affectedRows === 0) {
    throw new Error("Evento no encontrado");
  }
}
