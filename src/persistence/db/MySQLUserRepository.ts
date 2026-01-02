import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Usuario } from "../../models/Usuario";
import { UsuarioRepository } from "../../repositories/UsuarioRepository";
import pool from "./mysql";
import { UsuarioEstado } from "../../models/enums/usuarioEstado";

interface UsuarioRow extends RowDataPacket {
  id: string;
  codigo: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: Date;
  email: string;
  estado: UsuarioEstado;
  created_at: Date;
  updated_at: Date;
}

export class MySQLUserRepository implements UsuarioRepository {
  private mapRowToUsuario(row: UsuarioRow): Usuario {
    return {
      id: row.id,
      codigo: row.codigo,
      nombre: row.nombre,
      apellido: row.apellido,
      fechaNacimiento: row.fecha_nacimiento.toISOString().split('T')[0], // Solo la fecha
      email: row.email,
      estado: row.estado,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }

  async findById(id: string): Promise<Usuario | null> {
    const [rows] = await pool.query<UsuarioRow[]>(
      "SELECT * FROM usuarios WHERE id = ?",
      [id]
    );
    
    if (rows.length === 0) return null;
    return this.mapRowToUsuario(rows[0]);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const [rows] = await pool.query<UsuarioRow[]>(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    
    if (rows.length === 0) return null;
    return this.mapRowToUsuario(rows[0]);
  }

  async findAll(): Promise<Usuario[]> {
    const [rows] = await pool.query<UsuarioRow[]>(
      "SELECT * FROM usuarios ORDER BY created_at DESC"
    );
    
    return rows.map(row => this.mapRowToUsuario(row));
  }

  async save(usuario: Usuario): Promise<void> {
    await pool.query<ResultSetHeader>(
      `INSERT INTO usuarios 
       (id, codigo, nombre, apellido, fecha_nacimiento, email, estado, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuario.id,
        usuario.codigo,
        usuario.nombre,
        usuario.apellido,
        new Date(usuario.fechaNacimiento),
        usuario.email,
        usuario.estado,
        new Date(usuario.createdAt),
        new Date(usuario.updatedAt),
      ]
    );
  }

  async update(usuario: Usuario): Promise<void> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE usuarios 
       SET codigo = ?, nombre = ?, apellido = ?, fecha_nacimiento = ?, 
           email = ?, estado = ?, updated_at = ? 
       WHERE id = ?`,
      [
        usuario.codigo,
        usuario.nombre,
        usuario.apellido,
        new Date(usuario.fechaNacimiento),
        usuario.email,
        usuario.estado,
        new Date(usuario.updatedAt),
        usuario.id,
      ]
    );

    if (result.affectedRows === 0) {
      throw new Error("Usuario no encontrado");
    }
  }
}
