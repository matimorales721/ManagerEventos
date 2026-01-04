import { randomUUID } from "crypto";
import { Usuario } from "../models/Usuario";
import { UsuarioEstado } from "../models/enums/usuarioEstado";
import { UsuarioRol } from "../models/enums/usuarioRol";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { newDate } from "../utils/dateHelper";

interface CreateUsuarioDTO {
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // ISO
  email: string;
  rol?: UsuarioRol;
}

export class UsuarioService {
  constructor(private usuarioRepository: UsuarioRepository) {}

  // Genera un código único para el usuario
  private generateUserCode(): string {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `USR-${random}`;
  }

  async listarUsuarios(): Promise<Usuario[]> {
    return this.usuarioRepository.findAll();
  }

  async obtenerUsuario(id: string): Promise<Usuario | null> {
    return this.usuarioRepository.findById(id);
  }

  private generateId = (): string => randomUUID();

  // Creación de un nuevo usuario
  async crearUsuario(data: CreateUsuarioDTO): Promise<Usuario> {
    const existing = await this.usuarioRepository.findByEmail(data.email);
    if (existing && existing.estado === UsuarioEstado.ACTIVO) {
      throw new Error("Ya existe un usuario activo con ese email");
    }

    const ahora = newDate();
    const ahoraISO = ahora.toISOString();

    const usuario: Usuario = {
      id: this.generateId(),
      codigo: this.generateUserCode(),
      nombre: data.nombre,
      apellido: data.apellido,
      fechaNacimiento: data.fechaNacimiento,
      email: data.email,
      rol: data.rol || UsuarioRol.NORMAL,
      estado: UsuarioEstado.ACTIVO,
      createdAt: ahoraISO,
      updatedAt: ahoraISO,
    };

    await this.usuarioRepository.save(usuario);
    return usuario;
  }
}
