import { randomUUID } from "crypto";
import { Usuario } from "../models/Usuario";
import { UsuarioEstado } from "../models/enums/usuarioEstado";
import { UsuarioRol } from "../models/enums/usuarioRol";
import { getUsuarioRepository } from "../config/RepositoryFactory";
import { newDate } from "../utils/dateHelper";

const usuarioRepository = getUsuarioRepository();

interface CreateUsuarioDTO {
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // ISO
  email: string;
  rol?: UsuarioRol;
}

// Genera un código único para el usuario
const generateUserCode = (): string => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `USR-${random}`;
}

export const listarUsuarios = async (): Promise<Usuario[]> => {
  return usuarioRepository.findAll();
}

export const obtenerUsuario = async (id: string): Promise<Usuario | null> => {
  return usuarioRepository.findById(id);
}

const generateId = (): string => randomUUID();

// Creación de un nuevo usuario
export const crearUsuario = async (data: CreateUsuarioDTO): Promise<Usuario> => {
  const existing = await usuarioRepository.findByEmail(data.email);
  if (existing && existing.estado === UsuarioEstado.ACTIVO) {
    throw new Error("Ya existe un usuario activo con ese email");
  }

  const ahora = newDate();
  const ahoraISO = ahora.toISOString();

  const usuario: Usuario = {
    id: generateId(),
    codigo: generateUserCode(),
    nombre: data.nombre,
    apellido: data.apellido,
    fechaNacimiento: data.fechaNacimiento,
    email: data.email,
    rol: data.rol || UsuarioRol.NORMAL,
    estado: UsuarioEstado.ACTIVO,
    createdAt: ahoraISO,
    updatedAt: ahoraISO,
  };

  await usuarioRepository.save(usuario);
  return usuario;
}

