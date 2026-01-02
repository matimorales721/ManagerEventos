import { Evento } from "../../models/Evento";
import { EventoRepository } from "../../repositories/EventoRepository";
import { EVENTOS_FILE } from "../../config/paths";
import { readJsonFile, writeJsonFile } from "../../utils/fileUtils";

export class FileEventRepository implements EventoRepository {
  private async load(): Promise<Evento[]> {
    return readJsonFile<Evento[]>(EVENTOS_FILE, []);
  }

  private async saveAll(eventos: Evento[]): Promise<void> {
    await writeJsonFile(EVENTOS_FILE, eventos);
  }

  async findById(id: string): Promise<Evento | null> {
    const eventos = await this.load();
    return eventos.find((e) => e.id === id) ?? null;
  }

  async findAll(): Promise<Evento[]> {
    return this.load();
  }

  async agregarEvento(evento: Evento): Promise<void> {
    const eventos = await this.load();
    eventos.push(evento);
    await this.saveAll(eventos);
  }

  async update(evento: Evento): Promise<void> {
    const eventos = await this.load();
    const index = eventos.findIndex((e) => e.id === evento.id);
    if (index === -1) {
      throw new Error("Evento no encontrado");
    }
    eventos[index] = evento;
    await this.saveAll(eventos);
  }
}
