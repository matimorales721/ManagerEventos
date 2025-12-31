# API - Manager de Eventos

Sistema de gestión de eventos, usuarios y entradas desarrollado con Node.js, Express y TypeScript.

## Tabla de Contenidos

- [Información General](#información-general)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Endpoints](#endpoints)
  - [Usuarios](#usuarios)
  - [Eventos](#eventos)
  - [Entradas](#entradas)
- [Modelos de Datos](#modelos-de-datos)

---

## Información General

API REST para la gestión de eventos y venta de entradas. Permite:

- Crear y gestionar usuarios
- Crear y listar eventos
- Reservar, pagar y validar entradas
- Cancelar entradas vencidas automáticamente

**URL Base:** `http://localhost:3000`

---

## Tecnologías

- **Node.js**
- **Express.js** v5.2.1
- **TypeScript** v5.9.3
- **ts-node-dev** v2.0.0 (desarrollo)
- Persistencia en archivos JSON

---

## Instalación

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start
```

---

## Endpoints

### Usuarios

#### Crear Usuario

```bash
POST /usuarios
Content-Type: application/json

{
  "nombre": "Matias",
  "apellido": "Morales",
  "fechaNacimiento": "1990-01-01",
  "email": "matias@gmail.com"
}
```

**Ejemplo curl:**

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Matias",
    "apellido": "Morales",
    "fechaNacimiento": "1990-01-01",
    "email": "matias@gmail.com"
  }'
```

**Respuesta exitosa (201):**

```json
{
  "id": "145c06ff-3ead-4bb5-a989-4e8e68e7562f",
  "codigo": "USR-M2L01Z",
  "nombre": "Matias",
  "apellido": "Morales",
  "fechaNacimiento": "1990-01-01T00:00:00.000Z",
  "email": "matias@gmail.com",
  "estado": "ACTIVO",
  "createdAt": "2025-12-31T01:10:15.747Z",
  "updatedAt": "2025-12-31T01:10:15.747Z"
}
```

#### Listar Usuarios

```bash
GET /usuarios
```

**Ejemplo curl:**

```bash
curl http://localhost:3000/usuarios
```

#### Obtener Usuario por ID

```bash
GET /usuarios/:id
```

**Ejemplo curl:**

```bash
curl http://localhost:3000/usuarios/145c06ff-3ead-4bb5-a989-4e8e68e7562f
```

---

### Eventos

#### Crear Evento

```bash
POST /eventos
Content-Type: application/json

{
  "nombre": "Concierto de Rock",
  "fechaHora": "2025-12-31T20:00:00.000Z",
  "cupoTotal": 1000
}
```

**Ejemplo curl:**

```bash
curl -X POST http://localhost:3000/eventos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Concierto de Rock",
    "fechaHora": "2025-12-31T20:00:00.000Z",
    "cupoTotal": 1000
  }'
```

**Respuesta exitosa (201):**

```json
{
  "id": "3f023c42-26b5-489e-a122-19577964f3e7",
  "codigo": "EVT-XYZ123",
  "nombre": "Concierto de Rock",
  "fechaHora": "2025-12-31T20:00:00.000Z",
  "cupoTotal": 1000,
  "estado": "ACTIVO",
  "createdAt": "2025-12-31T01:00:00.000Z",
  "updatedAt": "2025-12-31T01:00:00.000Z"
}
```

#### Listar Eventos

```bash
GET /eventos
```

**Ejemplo curl:**

```bash
curl http://localhost:3000/eventos
```

#### Obtener Evento por ID

```bash
GET /eventos/:id
```

**Ejemplo curl:**

```bash
curl http://localhost:3000/eventos/3f023c42-26b5-489e-a122-19577964f3e7
```

---

### Entradas

#### Reservar Entrada

```bash
POST /entradas/reservar
Content-Type: application/json

{
  "eventoId": "3f023c42-26b5-489e-a122-19577964f3e7",
  "usuarioId": "145c06ff-3ead-4bb5-a989-4e8e68e7562f",
  "cantidadLocalidades": 3
}
```

**Ejemplo curl:**

```bash
curl -X POST http://localhost:3000/entradas/reservar \
  -H "Content-Type: application/json" \
  -d '{
    "eventoId": "3f023c42-26b5-489e-a122-19577964f3e7",
    "usuarioId": "145c06ff-3ead-4bb5-a989-4e8e68e7562f",
    "cantidadLocalidades": 3
  }'
```

**Respuesta exitosa (201):**

```json
{
  "id": "abc123",
  "codigo": "TKT-ABC123",
  "eventoId": "3f023c42-26b5-489e-a122-19577964f3e7",
  "usuarioId": "145c06ff-3ead-4bb5-a989-4e8e68e7562f",
  "cantidadLocalidades": 3,
  "estado": "NUEVA",
  "fechaReserva": "2025-12-31T01:15:00.000Z",
  "createdAt": "2025-12-31T01:15:00.000Z",
  "updatedAt": "2025-12-31T01:15:00.000Z"
}
```

#### Pagar Entrada

```bash
POST /entradas/pagar/:id
```

**Ejemplo curl:**

```bash
curl -X POST http://localhost:3000/entradas/pagar/fdaef8f4-a4f9-4aba-bd50-9208a6311f4f
```

**Respuesta exitosa (200):**

```json
{
  "id": "abc123",
  "codigo": "TKT-ABC123",
  "eventoId": "3f023c42-26b5-489e-a122-19577964f3e7",
  "usuarioId": "145c06ff-3ead-4bb5-a989-4e8e68e7562f",
  "cantidadLocalidades": 3,
  "estado": "ACTIVA",
  "fechaReserva": "2025-12-31T01:15:00.000Z",
  "fechaPago": "2025-12-31T01:20:00.000Z",
  "createdAt": "2025-12-31T01:15:00.000Z",
  "updatedAt": "2025-12-31T01:20:00.000Z"
}
```

#### Validar Entrada (por código)

```bash
POST /entradas/validar/:codigo
```

**Ejemplo curl:**

```bash
curl -X POST http://localhost:3000/entradas/validar/TKT-ABC123
```

**Respuesta exitosa (200):**

```json
{
  "id": "abc123",
  "codigo": "TKT-ABC123",
  "eventoId": "3f023c42-26b5-489e-a122-19577964f3e7",
  "usuarioId": "145c06ff-3ead-4bb5-a989-4e8e68e7562f",
  "cantidadLocalidades": 3,
  "estado": "UTILIZADA",
  "fechaReserva": "2025-12-31T01:15:00.000Z",
  "fechaPago": "2025-12-31T01:20:00.000Z",
  "fechaUso": "2025-12-31T20:00:00.000Z",
  "createdAt": "2025-12-31T01:15:00.000Z",
  "updatedAt": "2025-12-31T20:00:00.000Z"
}
```

#### Cancelar Entradas Vencidas

```bash
POST /entradas/cancelar-vencidas
```

**Ejemplo curl:**

```bash
curl -X POST http://localhost:3000/entradas/cancelar-vencidas
```

**Respuesta exitosa (200):**

```json
{
  "message": "Entradas vencidas canceladas",
  "cantidad": 5
}
```

#### Listar Entradas

```bash
GET /entradas
```

**Ejemplo curl:**

```bash
curl http://localhost:3000/entradas
```

**Con formato legible:**

```bash
curl http://localhost:3000/entradas | json_pp
```

#### Obtener Entrada por ID

```bash
GET /entradas/:id
```

**Ejemplo curl:**

```bash
curl http://localhost:3000/entradas/abc123
```

---

## Modelos de Datos

### Usuario

```typescript
{
  id: string; // UUID generado automáticamente
  codigo: string; // Código único (ej: "USR-M2L01Z")
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // ISO 8601
  email: string;
  estado: "ACTIVO" | "BORRADO";
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

**Estados posibles:**

- `ACTIVO`: Usuario activo en el sistema
- `BORRADO`: Usuario eliminado (soft delete)

### Evento

```typescript
{
  id: string; // UUID generado automáticamente
  codigo: string; // Código único del evento
  nombre: string;
  fechaHora: string; // ISO 8601
  cupoTotal: number; // Capacidad máxima
  estado: "ACTIVO" | "FINALIZADO" | "CANCELADO";
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

**Estados posibles:**

- `ACTIVO`: Evento disponible para venta
- `FINALIZADO`: Evento ya realizado
- `CANCELADO`: Evento cancelado

### Entrada

```typescript
{
  id: string;                 // UUID generado automáticamente
  codigo: string;             // Código único de entrada
  eventoId: string;           // Referencia al evento
  usuarioId: string;          // Referencia al usuario
  cantidadLocalidades: number;// Número de localidades reservadas
  estado: "NUEVA" | "ACTIVA" | "UTILIZADA" | "CANCELADA";
  fechaReserva: string;       // ISO 8601 - Cuándo se reservó
  fechaPago?: string;         // ISO 8601 - Cuándo se pagó
  fechaUso?: string;          // ISO 8601 - Cuándo se validó
  createdAt: string;          // ISO 8601
  updatedAt: string;          // ISO 8601
}
```

**Estados posibles:**

- `NUEVA`: Reservada pero no pagada
- `ACTIVA`: Pagada y lista para usar
- `UTILIZADA`: Validada en el evento
- `CANCELADA`: Vencida o cancelada

---

## Códigos de Respuesta HTTP

- **200**: OK - Solicitud exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Datos inválidos o error en la lógica de negocio
- **404**: Not Found - Recurso no encontrado
- **500**: Internal Server Error - Error del servidor

---

## Estructura del Proyecto

```
ManagerEventos/
├── data/                    # Archivos JSON de persistencia
│   ├── entradas.json
│   ├── eventos.json
│   └── usuarios.json
├── src/
│   ├── app.ts              # Configuración de Express
│   ├── server.ts           # Punto de entrada
│   ├── config/             # Configuraciones
│   ├── controllers/        # Controladores de rutas
│   ├── models/             # Interfaces y enums
│   ├── persistence/        # Capa de persistencia
│   ├── repositories/       # Interfaces de repositorios
│   ├── routes/             # Definición de rutas
│   ├── services/           # Lógica de negocio
│   └── utils/              # Utilidades
├── package.json
└── tsconfig.json
```

---

## Notas

- Las entradas reservadas (`NUEVA`) tienen un tiempo límite para ser pagadas antes de ser canceladas automáticamente.
- El sistema valida disponibilidad de cupo antes de permitir reservas.
- Todos los IDs son UUIDs generados automáticamente.
- Los códigos únicos se generan automáticamente para cada recurso.
- La persistencia se realiza en archivos JSON en la carpeta `data/`.

- Ideas para seguir desarrollando:
- - Hasta ahora ya crea Eventros, Usuarios, se pueden reservar entradas, y se puede verificar la entrada
- - Mejorar el tema de la hora. Creé un dateHelper que me da la hora con el formato que quiero pero no me convence
- - Implementar Vistas y Handlebars para tener un monolito
- - Implementar la BD
