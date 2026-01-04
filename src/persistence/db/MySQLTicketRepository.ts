import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Entrada } from "../../models/Entrada";
import { EntradaRepository } from "../../repositories/EntradaRepository";
import pool from "./mysql";
import { EntradaEstado } from "../../models/enums/entradaEstado";

export type EntradaRow = RowDataPacket & Entrada;

export class MySQLTicketRepository implements EntradaRepository {
  async findById(id: string): Promise<Entrada | null> {
    const [rows] = await pool.query<EntradaRow[]>(
      "SELECT id, codigo, idEvento eventoId, idUsuario usuarioId, cantidadLocalidades, est.descripcion estado, fechaReserva, fechaPago, fechaUso, createdAt, updatedAt FROM Entradas e join EntradaEstados est ON e.idEstado = est.idEstado WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return null;

    return rows[0];
  }

  async findByCodigo(codigo: string): Promise<Entrada | null> {
    const [rows] = await pool.query<EntradaRow[]>(
      "SELECT id, codigo, idEvento eventoId, idUsuario usuarioId, cantidadLocalidades, est.descripcion estado, fechaReserva, fechaPago, fechaUso, createdAt, updatedAt FROM Entradas e join EntradaEstados est ON e.idEstado = est.idEstado WHERE codigo = ?",
      [codigo]
    );

    if (rows.length === 0) return null;
    return rows[0];
  }

  async findAll(): Promise<Entrada[]> {
    const [rows] = await pool.query<EntradaRow[]>(
      "SELECT id, codigo, idEvento eventoId, idUsuario usuarioId, cantidadLocalidades, est.descripcion estado, fechaReserva, fechaPago, fechaUso, createdAt, updatedAt FROM Entradas e join EntradaEstados est ON e.idEstado = est.idEstado ORDER BY createdAt DESC"
    );

    return rows;
  }

  async findByEventoId(eventoId: string): Promise<Entrada[]> {
    const [rows] = await pool.query<EntradaRow[]>(
      "SELECT id, codigo, idEvento eventoId, idUsuario usuarioId, cantidadLocalidades, est.descripcion estado, fechaReserva, fechaPago, fechaUso, createdAt, updatedAt FROM Entradas e join EntradaEstados est ON e.idEstado = est.idEstado WHERE idEvento = ? ORDER BY createdAt DESC",
      [eventoId]
    );

    return rows;
  }

  async save(entrada: Entrada): Promise<void> {
    switch (entrada.estado) {
      case "NUEVA":
        var idEstado = 1;
        break;
      case "ACTIVA":
        var idEstado = 2;
        break;
      case "UTILIZADA":
        var idEstado = 3;
        break;
      case "CANCELADA":
        var idEstado = 4;
        break;
      default:
        throw new Error("Estado de entrada inválido");
    }

    await pool.query<ResultSetHeader>(
      `INSERT INTO Entradas 
       (id, codigo, idEvento, idUsuario, cantidadLocalidades, idEstado, 
        fechaReserva, fechaPago, fechaUso, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entrada.id,
        entrada.codigo,
        entrada.eventoId,
        entrada.usuarioId,
        entrada.cantidadLocalidades,
        idEstado,
        new Date(entrada.fechaReserva),
        entrada.fechaPago ? new Date(entrada.fechaPago) : null,
        entrada.fechaUso ? new Date(entrada.fechaUso) : null,
        new Date(entrada.createdAt),
        new Date(entrada.updatedAt),
      ]
    );
  }

  async update(entrada: Entrada): Promise<void> {
    switch (entrada.estado) {
      case "NUEVA":
        var idEstado = 1;
        break;
      case "ACTIVA":
        var idEstado = 2;
        break;
      case "UTILIZADA":
        var idEstado = 3;
        break;
      case "CANCELADA":
        var idEstado = 4;
        break;
      default:
        throw new Error("Estado de entrada inválido");
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE Entradas 
       SET codigo = ?, idEvento = ?, idUsuario = ?, cantidadLocalidades = ?, 
           idEstado = ?, fechaReserva = ?, fechaPago = ?, fechaUso = ?, 
           updatedAt = ? 
       WHERE id = ?`,
      [
        entrada.codigo,
        entrada.eventoId,
        entrada.usuarioId,
        entrada.cantidadLocalidades,
        idEstado,
        new Date(entrada.fechaReserva),
        entrada.fechaPago ? new Date(entrada.fechaPago) : null,
        entrada.fechaUso ? new Date(entrada.fechaUso) : null,
        new Date(entrada.updatedAt),
        entrada.id,
      ]
    );

    if (result.affectedRows === 0) {
      throw new Error("Entrada no encontrada");
    }
  }
}
