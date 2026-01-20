import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Usuario } from "../../models/Usuario";
import pool from "./mysql";
import { UsuarioEstado } from "../../models/enums/usuarioEstado";

export type UsuarioRow = RowDataPacket & Usuario;

export const findByUsername = async (username: string): Promise<Usuario | null> => {
  const [rows] = await pool.query<UsuarioRow[]>(
    "SELECT id, username, nombre, apellido, fechaNacimiento, email, rol.descripcion rol, est.descripcion estado, createdAt, updatedAt FROM Usuarios u join UsuarioEstados est on u.idEstado = est.idEstado join UsuariosRoles ur ON ur.idUsuario = u.id join UsuarioRoles rol on ur.idRol = rol.idRol WHERE username = ? ORDER BY ur.idRol LIMIT 1",
    [username]
  );

  if (rows.length === 0) return null;
  return rows[0];
}

export const findById = async (id: string): Promise<Usuario | null> => {
  const [rows] = await pool.query<UsuarioRow[]>(
    "SELECT id, username, nombre, apellido, fechaNacimiento, email, rol.descripcion rol, est.descripcion estado, createdAt, updatedAt FROM Usuarios u join UsuarioEstados est on u.idEstado = est.idEstado join UsuariosRoles ur ON ur.idUsuario = u.id join UsuarioRoles rol on ur.idRol = rol.idRol WHERE id = ? ORDER BY ur.idRol LIMIT 1",
    [id]
  );

  if (rows.length === 0) return null;
  return rows[0];
}

export const findByEmail = async (email: string): Promise<Usuario | null> => {
  const [rows] = await pool.query<UsuarioRow[]>(
    "SELECT id, password, username, nombre, apellido, fechaNacimiento, email, rol.descripcion rol, est.descripcion estado, createdAt, updatedAt FROM Usuarios u join UsuarioEstados est on u.idEstado = est.idEstado join UsuariosRoles ur ON ur.idUsuario = u.id join UsuarioRoles rol on ur.idRol = rol.idRol WHERE email = ? ORDER BY ur.idRol LIMIT 1",
    [email]
  );

  if (rows.length === 0) return null;
  return rows[0];
}

export const findAll = async (): Promise<Usuario[]> => {
  const [rows] = await pool.query<UsuarioRow[]>(
    "SELECT id, username, nombre, apellido, fechaNacimiento, email, rol.descripcion rol, est.descripcion estado, createdAt, updatedAt FROM Usuarios u join UsuariosRoles ur ON ur.idUsuario = u.id join UsuarioEstados est on u.idEstado = est.idEstado join UsuarioRoles rol on ur.idRol = rol.idRol ORDER BY createdAt DESC"
  );

  return rows;
}

export const createUser = async (usuario: Usuario): Promise<void> => {

  let idEstado: number;

  switch (usuario.estado) {
    case UsuarioEstado.ACTIVO:
      idEstado = 1;
      break;
    default:
      throw new Error("Estado de usuario inválido. Sólo se pueden crear usuarios en estado Activo.");
  }

  await pool.query<ResultSetHeader>(
    `INSERT INTO Usuarios 
       (id, username, nombre, apellido, fechaNacimiento, email, password, idEstado, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario.id,
      usuario.username,
      usuario.nombre,
      usuario.apellido,
      new Date(usuario.fechaNacimiento),
      usuario.email,
      usuario.password,
      idEstado,
      new Date(usuario.createdAt),
      new Date(usuario.updatedAt),
    ]
  );
}

export const update = async (usuario: Usuario): Promise<void> => {

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