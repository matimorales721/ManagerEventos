import { EventoRepository } from "../repositories/EventoRepository";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { EntradaRepository } from "../repositories/EntradaRepository";
import { FileEventRepository } from "../persistence/file/FileEventRepository";
import { FileUserRepository } from "../persistence/file/FileUserRepository";
import { FileTicketRepository } from "../persistence/file/FileTicketRepository";
import { MySQLEventRepository } from "../persistence/db/MySQLEventRepository";
import { MySQLUserRepository } from "../persistence/db/MySQLUserRepository";
import { MySQLTicketRepository } from "../persistence/db/MySQLTicketRepository";

type RepositoryType = "file" | "mysql";

export class RepositoryFactory {
  private static repositoryType: RepositoryType;

  static initialize(type?: string) {
    // Obtener el tipo desde variable de entorno o usar el parámetro
    const repoType = (type || process.env.REPOSITORY_TYPE || "file").toLowerCase();
    
    if (repoType !== "file" && repoType !== "mysql") {
      console.warn(`Tipo de repositorio inválido: ${repoType}. Usando 'file' por defecto.`);
      this.repositoryType = "file";
    } else {
      this.repositoryType = repoType as RepositoryType;
    }

    console.log(`✓ Repositorios configurados en modo: ${this.repositoryType.toUpperCase()}`);
  }

  static createEventoRepository(): EventoRepository {
    if (this.repositoryType === "mysql") {
      return new MySQLEventRepository();
    }
    return new FileEventRepository();
  }

  static createUsuarioRepository(): UsuarioRepository {
    if (this.repositoryType === "mysql") {
      return new MySQLUserRepository();
    }
    return new FileUserRepository();
  }

  static createEntradaRepository(): EntradaRepository {
    if (this.repositoryType === "mysql") {
      return new MySQLTicketRepository();
    }
    return new FileTicketRepository();
  }

  static getRepositoryType(): RepositoryType {
    return this.repositoryType;
  }
}
