# Manager de Eventos

Sistema de gestión de eventos y venta de entradas desarrollado con Node.js, Express, TypeScript y Handlebars.

---

## Información General

Aplicación completa para la gestión de eventos y venta de entradas con:

- **Frontend Web**: Interfaz de usuario con Handlebars y Bootstrap
- **API REST**: Endpoints bajo el prefijo `/api`
- **Sistema de Autenticación**: JWT con cookies HttpOnly
- **Persistencia Flexible**: Soporte para MySQL, MongoDB y archivos JSON (Actualmente solo está funcionando con MongoDB)

---

## Características

### Para Usuarios

- 🔐 Registro e inicio de sesión con validación de datos
- 🎫 Explorar eventos disponibles
- 📝 Reservar entradas para eventos
- 💳 Pago simulado de entradas reservadas
- 📱 Visualizar entradas con código único
- 📋 Gestionar mis entradas con filtros (Activas, Pendientes, Pasadas)

### Para Administradores

- 🎨 Crear eventos con imágenes
- ✅ Validar entradas por código
- 🔍 Buscar entradas por evento
- 📊 Ver detalles completos de cada entrada
- 🔄 Cancelar entradas vencidas manualmente

### Sistema

- 🔐 Autenticación JWT con cookies HttpOnly
- 🛡️ Rate limiting en endpoints de autenticación
- 🎨 Interfaz responsive con Bootstrap 5
- 👥 Roles de usuario (Normal/Admin)
- 📁 Carga de imágenes para eventos
- 🏗️ Arquitectura modular con controladores, servicios y repositorios

---

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales


# Modo desarrollo con hot reload
npm run dev

# Compilar TypeScript
npm run build

```

### Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto usando el .env.example.


# Ejemplos de API con CURL

Todos los endpoints de la API están bajo el prefijo `/api`.

---

## Autenticación

### Registro

Crear una nueva cuenta de usuario.

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juanperez",
    "email": "juan@example.com",
    "password": "Pa$$word2026",
    "nombre": "Juan",
    "apellido": "Pérez",
    "fechaNacimiento": "1990-05-15"
  }'
```

**Notas:**

- El usuario se crea con rol `NORMAL` por defecto

---

### Login

Iniciar sesión con credenciales existentes.

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "email": "juan@example.com",
    "password": "Pa$$word2026"
  }'
```

---

## Eventos

### Crear Evento (Admin)

Crear un nuevo evento. **Requiere rol ADMIN**.

**Sin imagen:**

```bash
curl -X POST http://localhost:3000/api/eventos \
  -b cookies.txt \
  -F "titulo=Festival de Jazz" \
  -F "descripcion=Noche de jazz en vivo" \
  -F "fechaHora=2026-08-15T19:00:00.000Z" \
  -F "cupoTotal=500" \
  -F "ubicacion=Teatro Municipal" \
  -F "direccion=Agustinas 794, Santiago Centro" \
  -F "precioLocalidad=35000" \
  -F "categoriaId=2"
```

---

### Listar Eventos

Obtener todos los eventos. **No requiere autenticación**.

```bash
curl -X GET http://localhost:3000/api/eventos
```

---

### Obtener Evento por ID

Obtener detalles de un evento específico. **No requiere autenticación**.

```bash
curl -X GET http://localhost:3000/api/eventos/69795ca7c7f8568844334718
```

---

## Entradas

### Reservar Entrada

Reservar una entrada para un evento. **Requiere autenticación**.

```bash
curl -X POST http://localhost:3000/api/entradas/reservar \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "eventoId": "69795ca7c7f8568844334718",
    "cantidadLocalidades": 2
  }'
```

**Notas:**

- El `usuarioId` se obtiene automáticamente del token JWT
- La entrada queda en estado `NUEVA` (pendiente de pago)
- Tiene 24 horas para pagar antes de que se cancele

---

### Pagar Entrada

Marcar una entrada como pagada. **Requiere autenticación**.

```bash
curl -X POST http://localhost:3000/api/entradas/pagar/69704c4c11efda0d86bcad4c \
  -b cookies.txt
```

**Notas:**

- Solo el dueño de la entrada puede pagarla
- Cambia el estado de `NUEVA` a `ACTIVA`
- Registra la fecha de pago

---

### Buscar Entrada

Buscar una entrada por código y/o evento. **Requiere autenticación**.
El codigo de entrada debe ser ingresado sin "ENT-" sólo los números
```bash
curl -X POST http://localhost:3000/api/entradas/buscar \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  eventoId \
  -d '{
    "codigoEntrada": "123455",
    "eventoId": "1235645734534535"
  }'
```
---

### Listar Mis Entradas

Obtener todas las entradas del usuario autenticado. **Requiere autenticación**.

```bash
curl -X GET http://localhost:3000/api/entradas \
  -b cookies.txt
```

---

### Obtener Entrada por ID

Obtener detalles de una entrada específica. **Requiere autenticación**.

```bash
curl -X GET http://localhost:3000/api/entradas/69704c4c11efda0d86bcad4c \
  -b cookies.txt
```

**Notas:**

- Solo el dueño de la entrada puede verla (excepto admins)

---

### Validar Entrada (Admin)

Validar una entrada en el evento. **Requiere autenticación y rol ADMIN**.

```bash
curl -X POST http://localhost:3000/api/entradas/validar/ABC123 \
  -b cookies.txt
```

**Notas:**

- Solo en el código de la entrada (sin prefijo `ENT-`)
- Cambia el estado de `ACTIVA` a `UTILIZADA`
- Registra la fecha de uso
- Solo usuarios ADMIN pueden validar entradas

---

### Cancelar Entradas Vencidas (Admin)

Cancelar todas las entradas que están vencidas. **Requiere autenticación y rol ADMIN**.

```bash
curl -X POST http://localhost:3000/api/entradas/cancelar-vencidas \
  -b cookies.txt
```

**Notas:**

- Cancela entradas en estado `NUEVA` que han pasado más de 24 horas
- Solo usuarios ADMIN pueden ejecutar esta acción
- Retorna la cantidad de entradas canceladas

