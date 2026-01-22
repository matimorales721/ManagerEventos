-- Migración para agregar campos titulo, descripcion e imagenUrl a la tabla Eventos
-- Ejecutar solo si ya tienes la tabla Eventos creada

-- Paso 1: Renombrar columna 'nombre' a 'titulo'
ALTER TABLE Eventos CHANGE COLUMN nombre titulo VARCHAR(255) NOT NULL;

-- Paso 2: Agregar columna 'descripcion'
ALTER TABLE Eventos ADD COLUMN descripcion TEXT NOT NULL DEFAULT '';

-- Paso 3: Agregar columna 'imagenUrl'
ALTER TABLE Eventos ADD COLUMN imagenUrl VARCHAR(500) AFTER cupoTotal;

-- Verificar la estructura
DESCRIBE Eventos;
