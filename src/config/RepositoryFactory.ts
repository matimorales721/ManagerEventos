import { EventoRepository } from "../repositories/evento.model";
import { UsuarioRepository } from "../repositories/usuario.model";
import { EntradaRepository } from "../repositories/entrada.model";

enum RepositoryType {
  FS = "FS", // File System
  SQL = "SQL", // MySQL
}

let repositoryType: RepositoryType;

export const initialize = (type?: string): void => {
  // Obtener el tipo desde variable de entorno o usar el parámetro
  const repoType = (type || process.env.REPOSITORY_TYPE || "SQL").toUpperCase();
  repositoryType = repoType as RepositoryType;
  console.log(`✓ Repositorios configurados en modo: ${repositoryType}`);
};

export const getEventoModel = (): EventoRepository => {
  switch (repositoryType) {
    case RepositoryType.SQL:
      return require("../persistence/db/mySQLEvent.model");
    case RepositoryType.FS:
      return require("../persistence/file/fileEvent.model");
  }
};

export const getUsuarioModel = (): UsuarioRepository => {
  switch (repositoryType) {
    case RepositoryType.SQL:
      return require("../persistence/db/mySQLUser.model");
    case RepositoryType.FS:
      return require("../persistence/file/fileUser.model");
  }
};

export const getEntradaModel = (): EntradaRepository => {
  switch (repositoryType) {
    case RepositoryType.SQL:
      return require("../persistence/db/mySQLTicket.model");
    case RepositoryType.FS:
      return require("../persistence/file/fileTicket.model");
  }
};

export const getModelType = (): RepositoryType => {
  return repositoryType;
};
