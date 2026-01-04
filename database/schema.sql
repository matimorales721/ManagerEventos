-- Schema para Manager de Eventos
-- MySQL Database

-- -- CREATE DATABASE IF NOT EXISTS ManagerEventosDB;
-- -- USE ManagerEventosDB;

-- Tabla de Estados de Usuario
CREATE TABLE IF NOT EXISTS UsuarioEstados (
    idEstado INT PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO UsuarioEstados (idEstado, descripcion) VALUES 
(1, 'ACTIVO'),
(2, 'BORRADO'); 
--ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- Tabla de Roles de Usuario
CREATE TABLE IF NOT EXISTS UsuarioRoles (
    idRol INT PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO UsuarioRoles (idRol, descripcion) VALUES 
(1, 'NORMAL'),
(2, 'ADMIN');
--ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    id VARCHAR(36) PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fechaNacimiento DATE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    idRol INT NOT NULL DEFAULT 1,
    idEstado INT NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idEstado) REFERENCES UsuarioEstados(idEstado),
    FOREIGN KEY (idRol) REFERENCES UsuarioRoles(idRol)
);

-- Tabla de Estados de Evento
CREATE TABLE IF NOT EXISTS EventoEstados (
    idEstado INT PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO EventoEstados (idEstado, descripcion) VALUES 
(1, 'ACTIVO'),
(2, 'FINALIZADO'),
(3, 'CANCELADO');
--ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- Tabla de Eventos
CREATE TABLE IF NOT EXISTS Eventos (
    id VARCHAR(36) PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    fechaHora DATETIME NOT NULL,
    cupoTotal INT NOT NULL,
    idEstado INT NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idEstado) REFERENCES EventoEstados(idEstado)
);

-- Tabla de Estados de Entrada
CREATE TABLE IF NOT EXISTS EntradaEstados (
    idEstado INT PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO EntradaEstados (idEstado, descripcion) VALUES 
(1, 'NUEVA'),
(2, 'ACTIVA'),
(3, 'UTILIZADA'),
(4, 'CANCELADA');
--ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- Tabla de Entradas
CREATE TABLE IF NOT EXISTS Entradas (
    id VARCHAR(36) PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    eventoId VARCHAR(36) NOT NULL,
    usuarioId VARCHAR(36) NOT NULL,
    cantidadLocalidades INT NOT NULL,
    idEstado INT NOT NULL DEFAULT 1,
    fechaReserva DATETIME NOT NULL,
    fechaPago DATETIME NULL,
    fechaUso DATETIME NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (eventoId) REFERENCES Eventos(id),
    FOREIGN KEY (usuarioId) REFERENCES Usuarios(id),
    FOREIGN KEY (idEstado) REFERENCES EntradaEstados(idEstado)
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_usuario_email ON Usuarios(email);
CREATE INDEX idx_entrada_evento ON Entradas(eventoId);
CREATE INDEX idx_entrada_usuario ON Entradas(usuarioId);
CREATE INDEX idx_entrada_codigo ON Entradas(codigo);
CREATE INDEX idx_evento_fechaHora ON Eventos(fechaHora);
