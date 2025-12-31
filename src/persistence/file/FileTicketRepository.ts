import { Entrada } from "../../models/Entrada";
import { EntradaRepository } from "../../repositories/EntradaRepository";
import { ENTRADAS_FILE } from "../../config/paths";
import { readJsonFile, writeJsonFile } from "../../utils/fileUtils";

export class FileTicketRepository implements EntradaRepository {
  private async load(): Promise<Entrada[]> {
    return readJsonFile<Entrada[]>(ENTRADAS_FILE, []);
  }

  private async saveAll(entradas: Entrada[]): Promise<void> {
    await writeJsonFile(ENTRADAS_FILE, entradas);
  }

  async findById(id: string): Promise<Entrada | null> {
    const entradas = await this.load();
    return entradas.find((e) => e.id === id) ?? null;
  }

  async findByCodigo(codigo: string): Promise<Entrada | null> {
    const entradas = await this.load();
    return entradas.find((e) => e.codigo === codigo) ?? null;
  }

  async findAll(): Promise<Entrada[]> {
    return this.load();
  }

  async findByEventoId(eventoId: string): Promise<Entrada[]> {
    const entradas = await this.load();
    return entradas.filter((e) => e.eventoId === eventoId);
  }

  async save(entrada: Entrada): Promise<void> {
    const entradas = await this.load();
    entradas.push(entrada);
    await this.saveAll(entradas);
  }

  async update(entrada: Entrada): Promise<void> {
    const entradas = await this.load();
    const index = entradas.findIndex((e) => e.id === entrada.id);
    if (index === -1) throw new Error("Entrada no encontrada");
    entradas[index] = entrada;
    await this.saveAll(entradas);
  }
}
