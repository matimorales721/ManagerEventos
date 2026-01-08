import { Usuario } from "../../models/Usuario";
import { UsuarioRepository } from "../../repositories/usuario.model";
import { USUARIOS_FILE } from "../../config/paths";
import { readJsonFile, writeJsonFile } from "../../utils/fileUtils";

// export class FileUserRepository implements UsuarioRepository {
const load = async (): Promise<Usuario[]> => {
  return readJsonFile<Usuario[]>(USUARIOS_FILE, []);
}

const saveAll = async (usuarios: Usuario[]): Promise<void> => {
  await writeJsonFile(USUARIOS_FILE, usuarios);
}

const findById = async (id: string): Promise<Usuario | null> => {
  const usuarios = await load();
  return usuarios.find((u) => u.id === id) ?? null;
}

const findByEmail = async (email: string): Promise<Usuario | null> => {
  const usuarios = await load();
  return usuarios.find((u) => u.email === email) ?? null;
}

const findAll = async (): Promise<Usuario[]> => {
  return load();
}

const save = async (usuario: Usuario): Promise<void> => {
  const usuarios = await load();
  usuarios.push(usuario);
  await saveAll(usuarios);
}

const update = async (usuario: Usuario): Promise<void> => {
  const usuarios = await load();
  const index = usuarios.findIndex((u) => u.id === usuario.id);
  if (index === -1) throw new Error("Usuario no encontrado");
  usuarios[index] = usuario;
  await saveAll(usuarios);
}

export { findById, findByEmail, findAll, save, update };
