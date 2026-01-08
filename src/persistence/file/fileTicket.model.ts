import { Entrada } from "../../models/Entrada";
import { EntradaRepository } from "../../repositories/entrada.model";
import { ENTRADAS_FILE } from "../../config/paths";
import { readJsonFile, writeJsonFile } from "../../utils/fileUtils";

// export class FileTicketRepository implements EntradaRepository {

const load = async (): Promise<Entrada[]> => {
  return readJsonFile<Entrada[]>(ENTRADAS_FILE, []);
}

const saveAll = async (entradas: Entrada[]): Promise<void> => {
  await writeJsonFile(ENTRADAS_FILE, entradas);
}

const findById = async (id: string): Promise<Entrada | null> => {
  const entradas = await load();
  return entradas.find((e) => e.id === id) ?? null;
}

const findByCodigo = async (codigo: string): Promise<Entrada | null> => {
  const entradas = await load();
  return entradas.find((e) => e.codigo === codigo) ?? null;
}

const findAll = async (): Promise<Entrada[]> => {
  return load();
}

const findByEventoId = async (eventoId: string): Promise<Entrada[]> => {
  const entradas = await load();
  return entradas.filter((e) => e.eventoId === eventoId);
}

const findByUsuarioId = async (usuarioId: string): Promise<Entrada[]> => {
  const entradas = await load();
  return entradas.filter((e) => e.usuarioId === usuarioId);
}

const save = async (entrada: Entrada): Promise<void> => {
  const entradas = await load();
  entradas.push(entrada);
  await saveAll(entradas);
}

const update = async (entrada: Entrada): Promise<void> => {
  const entradas = await load();
  const index = entradas.findIndex((e) => e.id === entrada.id);
  if (index === -1) throw new Error("Entrada no encontrada");
  entradas[index] = entrada;
  await saveAll(entradas);
}

export { findById, findByCodigo, findAll, findByEventoId, findByUsuarioId, save, update };