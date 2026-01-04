import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Usuario } from "../../models/Usuario";
import { UsuarioRepository } from "../../repositories/UsuarioRepository";
import pool from "./mysql";
import { UsuarioEstado } from "../../models/enums/usuarioEstado";
import { UsuarioRol } from "../../models/enums/usuarioRol";

export type UsuarioRow = RowDataPacket & Usuario;

export class MySQLUserRepository implements UsuarioRepository {

  async findById(id: string): Promise<Usuario | null> {
    const [rows] = await pool.query<UsuarioRow[]>(
      "SELECT id, codigo, nombre, apellido, fechaNacimiento, email, rol.descripcion rol, est.descripcion estado, createdAt, updatedAt FROM Usuarios u join UsuarioEstados est on u.idEstado = est.idEstado join UsuarioRoles rol on u.idRol = rol.idRol WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return null;
    return rows[0];
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const [rows] = await pool.query<UsuarioRow[]>(
      "SELECT id, codigo, nombre, apellido, fechaNacimiento, email, rol.descripcion rol, est.descripcion estado, createdAt, updatedAt FROM Usuarios u join UsuarioEstados est on u.idEstado = est.idEstado join UsuarioRoles rol on u.idRol = rol.idRol WHERE email = ?",
      [email]
    );

    if (rows.length === 0) return null;
    return rows[0];
  }

  async findAll(): Promise<Usuario[]> {
    const [rows] = await pool.query<UsuarioRow[]>(
      "SELECT id, codigo, nombre, apellido, fechaNacimiento, email, rol.descripcion rol, est.descripcion estado, createdAt, updatedAt FROM Usuarios u join UsuarioEstados est on u.idEstado = est.idEstado join UsuarioRoles rol on u.idRol = rol.idRol ORDER BY createdAt DESC"
    );

    return rows;
  }

  async save(usuario: Usuario): Promise<void> {

    let idEstado: number;
    switch (usuario.estado) {
      case UsuarioEstado.ACTIVO:
        idEstado = 1;
        break;
      case UsuarioEstado.BORRADO:
        idEstado = 2;
        break;
      default:
        throw new Error("Estado de usuario inválido");
    }

    let idRol: number;
    switch (usuario.rol) {
      case UsuarioRol.NORMAL:
        idRol = 1;
        break;
      case UsuarioRol.ADMIN:
        idRol = 2;
        break;
      default:
        throw new Error("Rol de usuario inválido");
    }

    await pool.query<ResultSetHeader>(
      `INSERT INTO Usuarios 
       (id, codigo, nombre, apellido, fechaNacimiento, email, idRol, idEstado, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuario.id,
        usuario.codigo,
        usuario.nombre,
        usuario.apellido,
        new Date(usuario.fechaNacimiento),
        usuario.email,
        idRol,
        idEstado,
        new Date(usuario.createdAt),
        new Date(usuario.updatedAt),
      ]
    );
  }

  async update(usuario: Usuario): Promise<void> {

    let idEstado: number;
    switch (usuario.estado) {
      case UsuarioEstado.ACTIVO:
        idEstado = 1;
        break;
      case UsuarioEstado.BORRADO:
        idEstado = 2;
        break;
      default:
        throw new Error("Estado de usuario inválido");
    }

    let idRol: number;
    switch (usuario.rol) {
      case UsuarioRol.NORMAL:
        idRol = 1;
        break;
      case UsuarioRol.ADMIN:
        idRol = 2;
        break;
      default:
        throw new Error("Rol de usuario inválido");
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE Usuarios 
       SET nombre = ?, apellido = ?, fechaNacimiento = ?, 
           email = ?, idRol = ?, idEstado = ?, updatedAt = ? 
       WHERE id = ?`,
      [
        usuario.nombre,
        usuario.apellido,
        new Date(usuario.fechaNacimiento),
        usuario.email,
        idRol,
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
