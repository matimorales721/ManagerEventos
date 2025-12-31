import { Usuario } from "../../models/Usuario";
import { UsuarioRepository } from "../../repositories/UsuarioRepository";
import { USUARIOS_FILE } from "../../config/paths";
import { readJsonFile, writeJsonFile } from "../../utils/fileUtils";

export class FileUserRepository implements UsuarioRepository {
  private async load(): Promise<Usuario[]> {
    return readJsonFile<Usuario[]>(USUARIOS_FILE, []);
  }

  private async saveAll(usuarios: Usuario[]): Promise<void> {
    await writeJsonFile(USUARIOS_FILE, usuarios);
  }

  async findById(id: string): Promise<Usuario | null> {
    const usuarios = await this.load();
    return usuarios.find((u) => u.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuarios = await this.load();
    return usuarios.find((u) => u.email === email) ?? null;
  }

  async findAll(): Promise<Usuario[]> {
    return this.load();
  }

  async save(usuario: Usuario): Promise<void> {
    const usuarios = await this.load();
    usuarios.push(usuario);
    await this.saveAll(usuarios);
  }

  async update(usuario: Usuario): Promise<void> {
    const usuarios = await this.load();
    const index = usuarios.findIndex((u) => u.id === usuario.id);
    if (index === -1) throw new Error("Usuario no encontrado");
    usuarios[index] = usuario;
    await this.saveAll(usuarios);
  }
}
