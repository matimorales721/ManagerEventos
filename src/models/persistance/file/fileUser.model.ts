import { IUsuario } from "../../../types/Usuario";
import { USUARIOS_FILE } from "../../../config/paths";
import { readJsonFile, writeJsonFile } from "../../../utils/fileUtils";

const load = async (): Promise<IUsuario[]> => {
  return readJsonFile<IUsuario[]>(USUARIOS_FILE, []);
}

const saveAll = async (usuarios: IUsuario[]): Promise<void> => {
  await writeJsonFile(USUARIOS_FILE, usuarios);
}

const findByUsername = async (username: string): Promise<IUsuario | null> => {
  const usuarios = await load();
  return usuarios.find((u) => u.username === username) ?? null;
}

const findByEmail = async (email: string): Promise<IUsuario | null> => {
  const usuarios = await load();
  return usuarios.find((u) => u.email === email) ?? null;
}

const findAll = async (): Promise<IUsuario[]> => {
  return load();
}

const createUser = async (usuario: IUsuario): Promise<void> => {
  const usuarios = await load();
  usuarios.push(usuario);
  await saveAll(usuarios);
}

const update = async (usuario: IUsuario): Promise<void> => {
  const usuarios = await load();
  const index = usuarios.findIndex((u) => u.id === usuario.id);
  if (index === -1) throw new Error("Usuario no encontrado");
  usuarios[index] = usuario;
  await saveAll(usuarios);
}

const findById = async (id: string): Promise<IUsuario | null> => {
  const usuarios = await load();
  return usuarios.find((u) => u.id === id) ?? null;
}

export { findById, findByUsername, findByEmail, findAll, createUser, update };
