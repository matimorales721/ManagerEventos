import { EventoRepository } from "../repositories/evento.model";
import { UsuarioRepository } from "../repositories/usuario.model";
import { EntradaRepository } from "../repositories/entrada.model";

enum RepositoryType {
  FS = "FS", // File System
  SQL = "SQL", // MySQL
}

let repositoryType: RepositoryType = RepositoryType.FS;

export const initialize = (type?: string): void => {
  // Obtener el tipo desde variable de entorno o usar el parámetro
  const repoType = (type || process.env.REPOSITORY_TYPE || "FS").toUpperCase();
  repositoryType = repoType as RepositoryType;
  console.log(`✓ Repositorios configurados en modo: ${repositoryType}`);
};

export const getEventoRepository = (): EventoRepository => {
  switch (repositoryType) {
    case RepositoryType.SQL:
      return require("../persistence/db/mySQLEvent.model");
    case RepositoryType.FS:
    default:
      return require("../persistence/file/fileEvent.model");
  }
};

export const getUsuarioRepository = (): UsuarioRepository => {
  switch (repositoryType) {
    case RepositoryType.SQL:
      return require("../persistence/db/mySQLUser.model");
    case RepositoryType.FS:
    default:
      return require("../persistence/file/fileUser.model");
  }
};

export const getEntradaRepository = (): EntradaRepository => {
  switch (repositoryType) {
    case RepositoryType.SQL:
      return require("../persistence/db/mySQLTicket.model");
    case RepositoryType.FS:
    default:
      return require("../persistence/file/fileTicket.model");
  }
};

export const getRepositoryType = (): RepositoryType => {
  return repositoryType;
};
