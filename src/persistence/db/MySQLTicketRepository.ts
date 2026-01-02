import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Entrada } from "../../models/Entrada";
import { EntradaRepository } from "../../repositories/EntradaRepository";
import pool from "./mysql";
import { EntradaEstado } from "../../models/enums/entradaEstado";

interface EntradaRow extends RowDataPacket {
  id: string;
  codigo: string;
  evento_id: string;
  usuario_id: string;
  cantidad_localidades: number;
  estado: EntradaEstado;
  fecha_reserva: Date;
  fecha_pago: Date | null;
  fecha_uso: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class MySQLTicketRepository implements EntradaRepository {
  private mapRowToEntrada(row: EntradaRow): Entrada {
    return {
      id: row.id,
      codigo: row.codigo,
      eventoId: row.evento_id,
      usuarioId: row.usuario_id,
      cantidadLocalidades: row.cantidad_localidades,
      estado: row.estado,
      fechaReserva: row.fecha_reserva.toISOString(),
      fechaPago: row.fecha_pago ? row.fecha_pago.toISOString() : undefined,
      fechaUso: row.fecha_uso ? row.fecha_uso.toISOString() : undefined,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }

  async findById(id: string): Promise<Entrada | null> {
    const [rows] = await pool.query<EntradaRow[]>(
      "SELECT * FROM entradas WHERE id = ?",
      [id]
    );
    
    if (rows.length === 0) return null;
    return this.mapRowToEntrada(rows[0]);
  }

  async findByCodigo(codigo: string): Promise<Entrada | null> {
    const [rows] = await pool.query<EntradaRow[]>(
      "SELECT * FROM entradas WHERE codigo = ?",
      [codigo]
    );
    
    if (rows.length === 0) return null;
    return this.mapRowToEntrada(rows[0]);
  }

  async findAll(): Promise<Entrada[]> {
    const [rows] = await pool.query<EntradaRow[]>(
      "SELECT * FROM entradas ORDER BY created_at DESC"
    );
    
    return rows.map(row => this.mapRowToEntrada(row));
  }

  async findByEventoId(eventoId: string): Promise<Entrada[]> {
    const [rows] = await pool.query<EntradaRow[]>(
      "SELECT * FROM entradas WHERE evento_id = ? ORDER BY created_at DESC",
      [eventoId]
    );
    
    return rows.map(row => this.mapRowToEntrada(row));
  }

  async save(entrada: Entrada): Promise<void> {
    await pool.query<ResultSetHeader>(
      `INSERT INTO entradas 
       (id, codigo, evento_id, usuario_id, cantidad_localidades, estado, 
        fecha_reserva, fecha_pago, fecha_uso, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entrada.id,
        entrada.codigo,
        entrada.eventoId,
        entrada.usuarioId,
        entrada.cantidadLocalidades,
        entrada.estado,
        new Date(entrada.fechaReserva),
        entrada.fechaPago ? new Date(entrada.fechaPago) : null,
        entrada.fechaUso ? new Date(entrada.fechaUso) : null,
        new Date(entrada.createdAt),
        new Date(entrada.updatedAt),
      ]
    );
  }

  async update(entrada: Entrada): Promise<void> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE entradas 
       SET codigo = ?, evento_id = ?, usuario_id = ?, cantidad_localidades = ?, 
           estado = ?, fecha_reserva = ?, fecha_pago = ?, fecha_uso = ?, 
           updated_at = ? 
       WHERE id = ?`,
      [
        entrada.codigo,
        entrada.eventoId,
        entrada.usuarioId,
        entrada.cantidadLocalidades,
        entrada.estado,
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
