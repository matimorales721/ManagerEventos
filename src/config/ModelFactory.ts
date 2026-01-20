import { IEventoModel } from "../models/IEvento.model";
import { IUsuarioModel } from "../models/IUsuario.model";
import { IEntradaModel } from "../models/IEntrada.model";

enum RepositoryType {
  FS = "FS", // File System
  SQL = "SQL", // MySQL
  MONGO = "MONGO" // MongoDB
}

let repositoryType: RepositoryType;

export const initialize = (type?: string): void => {
  // Obtener el tipo desde variable de entorno o usar el parámetro
  const repoType = (type || process.env.REPOSITORY_TYPE || "FS").toUpperCase();
  repositoryType = repoType as RepositoryType;
  console.log(`✓ Repositorios configurados en modo: ${repositoryType}`);
};

export const getEventoModel = (): IEventoModel => {
  switch (repositoryType) {
    case RepositoryType.SQL:
      return require("../models/persistance/db/mySQLEvent.model");
    case RepositoryType.FS:
      return require("../models/persistance/file/fileEvent.model");
    case RepositoryType.MONGO:
      return require("../models/persistance/mongo/mongoEvent.model");
  }
};

export const getUsuarioModel = (): IUsuarioModel => {
  switch (repositoryType) {
    case RepositoryType.SQL:
      return require("../models/persistance/db/mySQLUser.model");
    case RepositoryType.FS:
      return require("../models/persistance/file/fileUser.model");
    case RepositoryType.MONGO:
      return require("../models/persistance/mongo/mongoUser.model");
  }
};

export const getEntradaModel = (): IEntradaModel => {
  switch (repositoryType) {
    case RepositoryType.SQL:
      return require("../models/persistance/db/mySQLTicket.model");
    case RepositoryType.FS:
      return require("../models/persistance/file/fileTicket.model");
    case RepositoryType.MONGO:
      return require("../models/persistance/mongo/mongoTicket.model");
  }
};

export const getModelType = (): RepositoryType => {
  return repositoryType;
};
