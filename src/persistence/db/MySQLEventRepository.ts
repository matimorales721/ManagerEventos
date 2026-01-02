import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Evento } from "../../models/Evento";
import { EventoRepository } from "../../repositories/EventoRepository";
import pool from "./mysql";

export type EventoRow = RowDataPacket & Evento;

export class MySQLEventRepository implements EventoRepository {
  
  async findById(id: string): Promise<Evento | null> {
    const [rows] = await pool.query<EventoRow[]>(
      "SELECT id, codigo, nombre, fechaHora, cupoTotal, est.descripcion estado, createdAt, updatedAt FROM Eventos e join EventoEstados est on est.idEstado = e.idEstado  WHERE id = ?",
      [id]
    );
    
    if (rows.length === 0) return null;
    return rows[0];
  }

  async findAll(): Promise<Evento[]> {
    const [rows] = await pool.query<EventoRow[]>(
      "SELECT id, codigo, nombre, fechaHora, cupoTotal, est.descripcion estado, createdAt, updatedAt FROM Eventos e join EventoEstados est on est.idEstado = e.idEstado ORDER BY fechaHora DESC"
    );
    
    return rows;
  }

    async agregarEvento(evento: Evento): Promise<void> {
        
        switch (evento.estado) {
            case 'ACTIVO':
                var idEstado = 1;
                break;
            case 'CANCELADO':
                var idEstado = 2;
                break;
            case 'FINALIZADO':
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

  async update(evento: Evento): Promise<void> {
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
}
