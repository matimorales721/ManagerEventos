import { IEntrada } from "../../../types/Entrada";
import { ENTRADAS_FILE } from "../../../config/paths";
import { readJsonFile, writeJsonFile } from "../../../utils/fileUtils";

// export class FileTicketRepository implements EntradaRepository {

const load = async (): Promise<IEntrada[]> => {
  return readJsonFile<IEntrada[]>(ENTRADAS_FILE, []);
}

const saveAll = async (entradas: IEntrada[]): Promise<void> => {
  await writeJsonFile(ENTRADAS_FILE, entradas);
}

const findById = async (id: string): Promise<IEntrada | null> => {
  const entradas = await load();
  return entradas.find((e) => e.id === id) ?? null;
}

const findByCodigo = async (codigo: string): Promise<IEntrada | null> => {
  const entradas = await load();
  return entradas.find((e) => e.codigo === codigo) ?? null;
}

const findAll = async (): Promise<IEntrada[]> => {
  return load();
}

const findByEventoId = async (eventoId: string): Promise<IEntrada[]> => {
  const entradas = await load();
  return entradas.filter((e) => e.eventoId === eventoId);
}

const findByUsuarioId = async (usuarioId: string): Promise<IEntrada[]> => {
  const entradas = await load();
  return entradas.filter((e) => e.usuarioId === usuarioId);
}

const save = async (entrada: IEntrada): Promise<void> => {
  const entradas = await load();
  entradas.push(entrada);
  await saveAll(entradas);
}

const update = async (entrada: IEntrada): Promise<void> => {
  const entradas = await load();
  const index = entradas.findIndex((e) => e.id === entrada.id);
  if (index === -1) throw new Error("Entrada no encontrada");
  entradas[index] = entrada;
  await saveAll(entradas);
}

export { findById, findByCodigo, findAll, findByEventoId, findByUsuarioId, save, update };