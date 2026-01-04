import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Usuario } from "../../models/Usuario";
import { UsuarioRepository } from "../../repositories/UsuarioRepository";
import pool from "./mysql";
import { UsuarioEstado } from "../../models/enums/usuarioEstado";

export type UsuarioRow = RowDataPacket & Usuario;

export class MySQLUserRepository implements UsuarioRepository {
  
  async findById(id: string): Promise<Usuario | null> {
    const [rows] = await pool.query<UsuarioRow[]>(
      "SELECT id, codigo, nombre, apellido, fechaNacimiento, email, est.descripcion estado, createdAt, updatedAt FROM Usuarios join UsuarioEstados est WHERE id = ?",
      [id]
    );
    
    if (rows.length === 0) return null;
    return rows[0];
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const [rows] = await pool.query<UsuarioRow[]>(
      "SELECT id, codigo, nombre, apellido, fechaNacimiento, email, est.descripcion estado, createdAt, updatedAt FROM Usuarios u join UsuarioEstados est on u.idEstado = est.idEstado WHERE email = ?",
      [email]
    );
    
    if (rows.length === 0) return null;
    return rows[0];
  }

  async findAll(): Promise<Usuario[]> {
    const [rows] = await pool.query<UsuarioRow[]>(
      "SELECT id, codigo, nombre, apellido, fechaNacimiento, email, est.descripcion estado, createdAt, updatedAt FROM Usuarios u join UsuarioEstados est on u.idEstado = est.idEstado ORDER BY createdAt DESC"
    );
    
    return rows;
  }

  async save(usuario: Usuario): Promise<void> {

    switch (usuario.estado) {
      case 'ACTIVO':
        var idEstado = 1;
        break;
      case 'BORRADO':
        var idEstado = 2;
        break;
      default:
        throw new Error("Estado de usuario inválido");
    }

    await pool.query<ResultSetHeader>(
      `INSERT INTO Usuarios 
       (id, codigo, nombre, apellido, fechaNacimiento, email, idEstado, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuario.id,
        usuario.codigo,
        usuario.nombre,
        usuario.apellido,
        new Date(usuario.fechaNacimiento),
        usuario.email,
        idEstado,
        new Date(usuario.createdAt),
        new Date(usuario.updatedAt),
      ]
    );
  }

  async update(usuario: Usuario): Promise<void> {
    
    switch (usuario.estado) {
      case 'ACTIVO':
        var idEstado = 1;
        break;
      case 'BORRADO':
        var idEstado = 2;
        break;
      default:
        throw new Error("Estado de usuario inválido");
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE Usuarios 
       SET nombre = ?, apellido = ?, fechaNacimiento = ?, 
           email = ?, idEstado = ?, updatedAt = ? 
       WHERE id = ?`,
      [
        usuario.nombre,
        usuario.apellido,
        new Date(usuario.fechaNacimiento),
        usuario.email,
        idEstado,
        new Date(usuario.updatedAt),
        usuario.id,
      ]
    );

    if (result.affectedRows === 0) {
      throw new Error("Usuario no encontrado");
    }
  }
}
