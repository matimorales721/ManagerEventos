import { IEvento } from "../../../types/Evento";
import { EVENTOS_FILE } from "../../../config/paths";
import { readJsonFile, writeJsonFile } from "../../../utils/fileUtils";

// export class FileEventRepository implements EventoRepository {

const load = async (): Promise<IEvento[]> => {
  return readJsonFile<IEvento[]>(EVENTOS_FILE, []);
}

const saveAll = async (eventos: IEvento[]): Promise<void> => {
  await writeJsonFile(EVENTOS_FILE, eventos);
}

const findById = async (id: string): Promise<IEvento | null> => {
  const eventos = await load();
  return eventos.find((e) => e.id === id) ?? null;
}

const findAll = async (): Promise<IEvento[]> => {
  return load();
}

const agregarEvento = async (evento: IEvento): Promise<void> => {
  const eventos = await load();
  eventos.push(evento);
  await saveAll(eventos);
}

const update = async (evento: IEvento): Promise<void> => {
  const eventos = await load();
  const index = eventos.findIndex((e) => e.id === evento.id);
  if (index === -1) {
    throw new Error("Evento no encontrado");
  }
  eventos[index] = evento;
  await saveAll(eventos);
}

export { findById, findAll, agregarEvento, update };