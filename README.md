# Manager de Eventos

Sistema de gestión de eventos, usuarios y entradas desarrollado con Node.js, Express, TypeScript y Handlebars.

## Tabla de Contenidos

- [Información General](#información-general)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Vistas Web](#vistas-web)
- [API REST](#api-rest)
  - [Usuarios](#usuarios)
  - [Eventos](#eventos)
  - [Entradas](#entradas)
- [Modelos de Datos](#modelos-de-datos)

---

## Información General

Aplicación completa para la gestión de eventos y venta de entradas con:

- **Frontend Web**: Interfaz de usuario con Handlebars y Bootstrap
- **API REST**: Endpoints para integración con otros sistemas

**URL Base:** `http://localhost:3000`

---

## Características

### Para Usuarios

- 🎫 Explorar eventos disponibles con buscador en tiempo real
- 📝 Reservar entradas para eventos
- 💳 Pago simulado de entradas reservadas
- 📱 Visualizar entradas con código QR (mock)
- 📋 Gestionar mis entradas con filtros (Activas, Pendientes, Pasadas)

### Para Administradores

- ✅ Validar entradas por código o escaneo de QR
- 🔍 Buscar entradas por evento
- 📊 Ver detalles completos de cada entrada

### Sistema

- 🔄 Cancelación automática de entradas vencidas
- 📧 Notificaciones por email (simuladas)
- 🎨 Interfaz responsive con Bootstrap 5
- 🔐 Roles de usuario (Normal/Admin)

---

## Tecnologías

- **Node.js**
- **Express.js** v5.2.1
- **TypeScript** v5.9.3
- **Handlebars** (express-handlebars) - Motor de plantillas
- **Bootstrap** v5.3.0 - Framework CSS
- **MySQL2** v3.16.0 - Base de datos
- **dotenv** v17.2.3
- **express-session** - Manejo de sesiones
- **ts-node-dev** v2.0.0 (desarrollo)

---

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL

# Crear base de datos MySQL
# Ejecutar el script database/schema.sql en tu servidor MySQL

# Modo desarrollo
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start
```

### Configuración de Base de Datos

El proyecto utiliza **MySQL** como base de datos:

1. Asegúrate de tener MySQL corriendo
2. Ejecuta el script [database/schema.sql](database/schema.sql) para crear las tablas
3. Configura tu archivo `.env` con las credenciales:
   ```env
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=ManagerEventosDB
   ```

### Usuario Mockeado

Por defecto, el sistema utiliza un usuario mockeado para pruebas:

- **Usuario Normal**: Juan Pérez (juan.perez@example.com)
- **Usuario Admin**: Admin Sistema (admin@example.com)

Puedes cambiar entre ellos agregando `?admin=true` a la URL o desde el menú del navbar.

---

## Vistas Web

### Páginas Disponibles

#### Para Usuarios Normales

- **`/`** - Home: Lista de eventos con buscador
- **`/eventos/:id`** - Detalle de evento
- **`/eventos/:id/reservar`** - Formulario de reserva
- **`/entradas/:id/pagar`** - Página de pago
- **`/mis-entradas`** - Mis entradas con filtros
- **`/entradas/:id`** - Detalle de entrada con QR

#### Para Administradores

- **`/validar-entradas`** - Validar entradas por código

### Navegación

La aplicación incluye una barra de navegación con:

- Enlace a Home
- Enlace a Mis Entradas
- Enlace a Validar Entradas (solo para admins)
- Dropdown de usuario con opción para cambiar entre usuario normal y admin

---

## API REST

Los endpoints de la API REST siguen disponibles para integración con otros sistemas.

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
├── database/                # Scripts SQL
│   └── schema.sql          # Schema de MySQL
├── public/                  # Archivos estáticos
│   ├── css/                # Estilos personalizados
│   ├── js/                 # JavaScript del cliente
│   └── images/             # Imágenes
├── src/
│   ├── app.ts              # Configuración de Express y Handlebars
│   ├── server.ts           # Punto de entrada
│   ├── config/             # Configuraciones
│   ├── controllers/        # Controladores (API y Vistas)
│   │   ├── EntradaController.ts
│   │   ├── EventoController.ts
│   │   ├── UsuarioController.ts
│   │   └── ViewController.ts  # Controlador de vistas web
│   ├── middleware/         # Middlewares
│   │   └── mockUser.ts     # Usuario mockeado
│   ├── models/             # Interfaces y enums
│   │   ├── Entrada.ts
│   │   ├── Evento.ts
│   │   ├── Usuario.ts
│   │   └── enums/
│   │       ├── entradaEstado.ts
│   │       ├── eventoEstado.ts
│   │       ├── usuarioEstado.ts
│   │       └── usuarioRol.ts  # Roles (NORMAL/ADMIN)
│   ├── persistence/        # Capa de persistencia
│   │   └── db/             # Repositorios MySQL
│   ├── repositories/       # Interfaces de repositorios
│   ├── routes/             # Definición de rutas
│   │   ├── entradas.routes.ts
│   │   ├── eventos.routes.ts
│   │   ├── usuarios.routes.ts
│   │   └── views.routes.ts    # Rutas de vistas web
│   ├── services/           # Lógica de negocio
│   └── utils/              # Utilidades
├── views/                   # Plantillas Handlebars
│   ├── layouts/
│   │   └── main.hbs        # Layout principal
│   ├── partials/
│   │   └── navbar.hbs      # Barra de navegación
│   ├── home.hbs
│   ├── evento.hbs
│   ├── reservar-entrada.hbs
│   ├── reserva-confirmada.hbs
│   ├── pagar-entrada.hbs
│   ├── pago-confirmado.hbs
│   ├── mis-entradas.hbs
│   ├── entrada-detalle.hbs
│   ├── validar-entradas.hbs
│   └── error.hbs
├── .env                    # Variables de entorno (no versionado)
├── .env.example            # Plantilla de variables de entorno
├── package.json
└── tsconfig.json
```

---

## Notas

- Las entradas reservadas (`NUEVA`) tienen un tiempo límite de 24 horas para ser pagadas antes de ser canceladas automáticamente.
- El sistema valida disponibilidad de cupo antes de permitir reservas.
- Todos los IDs son UUIDs generados automáticamente.
- Los códigos únicos se generan automáticamente para cada recurso.
- **Precio por localidad**: $5,000 (simulado)
- **Usuario mockeado**: El sistema incluye un middleware que simula usuarios logueados para pruebas

---

## Hitos Completados

- ✅ Endpoints REST de Eventos, Usuarios y Entradas
- ✅ Implementación de MySQL como base de datos
- ✅ Vistas web con Handlebars y Bootstrap
- ✅ Sistema de roles (Normal/Admin)
- ✅ Validación de entradas para administradores
- ✅ Gestión completa del flujo de reserva y pago

---

## Ideas para Desarrollo Futuro

- 🔐 Implementar autenticación real con JWT o sesiones
- 💳 Integrar API real de MercadoPago
- 📧 Envío de emails reales con confirmaciones
- 📱 Generar códigos QR reales
- 📊 Panel de administración completo
- 📈 Estadísticas y reportes de eventos
- 🎨 Mejorar diseño y UX
- ⏰ Sistema de recordatorios para eventos próximos
- 🔔 Notificaciones en tiempo real
- 📱 Aplicación móvil nativa
