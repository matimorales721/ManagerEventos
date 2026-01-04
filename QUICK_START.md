# Guía de Inicio Rápido - Manager de Eventos

## 🚀 Inicio Rápido

### 1. Configurar Base de Datos

```bash
# Acceder a MySQL
mysql -u root -p

# Ejecutar el script
source database/schema.sql

# O copiar y pegar el contenido del archivo en MySQL Workbench
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=ManagerEventosDB
```

### 3. Instalar y Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### 4. Acceder a la Aplicación

- **Interfaz Web**: http://localhost:3000
- **API REST**: http://localhost:3000/eventos, /usuarios, /entradas

## 👥 Usuarios de Prueba

Por defecto, el sistema tiene dos usuarios mockeados:

### Usuario Normal

- **Nombre**: Juan Pérez
- **Email**: juan.perez@example.com
- **Código**: USR-MOCK01

### Usuario Administrador

- **Nombre**: Admin Sistema
- **Email**: admin@example.com
- **Código**: USR-ADMIN01

**Cambiar entre usuarios**: Agrega `?admin=true` a cualquier URL o usa el menú en el navbar.

## 📋 Flujo de Uso

### Para Usuarios Normales

1. **Ver Eventos** → Ve a http://localhost:3000
2. **Buscar Evento** → Usa el buscador para filtrar eventos
3. **Ver Detalle** → Click en un evento
4. **Reservar Entrada** → Click en "Reservar Entradas"
5. **Seleccionar Cantidad** → Elige cuántas localidades
6. **Confirmar Reserva** → La entrada queda en estado "PENDIENTE DE PAGO"
7. **Pagar Entrada** → Click en "Ir a Realizar Pago"
8. **Simular Pago** → Click en "Pagar con MercadoPago"
9. **Ver Mis Entradas** → Menu → Mis Entradas
10. **Ver Detalle de Entrada** → Click en "Ver Entrada" (incluye QR mock)

### Para Administradores

1. **Cambiar a Admin** → URL con `?admin=true` o desde el navbar
2. **Ir a Validar Entradas** → Menu → Validar Entradas
3. **Seleccionar Evento** → Elegir el evento del dropdown
4. **Ingresar Código** → Escribir el código de la entrada (sin ENT-)
5. **Buscar** → Click en Buscar
6. **Verificar Entrada** → Se muestra la información de la entrada
7. **Validar** → Click en "Verificar ✓"
8. **Confirmación** → La entrada pasa a estado "UTILIZADA"

## 🔧 Comandos Útiles

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar versión compilada
npm start

# Ejecutar script SQL
mysql -u root -p ManagerEventosDB < database/schema.sql
```

## 🗂️ Estructura de Roles

### Usuario Normal

- ✅ Ver eventos
- ✅ Reservar entradas
- ✅ Pagar entradas
- ✅ Ver mis entradas
- ❌ Validar entradas

### Usuario Admin

- ✅ Ver eventos
- ✅ Reservar entradas
- ✅ Pagar entradas
- ✅ Ver mis entradas
- ✅ **Validar entradas de otros usuarios**

## 📝 Estados de Entrada

- **NUEVA** → Reservada pero no pagada (24 horas para pagar)
- **ACTIVA** → Pagada y lista para usar
- **UTILIZADA** → Ya fue validada en el evento
- **CANCELADA** → Venció el plazo de pago o el evento pasó

## 🎨 Características de la Interfaz

- **Responsive**: Funciona en móviles, tablets y escritorio
- **Buscador en Tiempo Real**: Filtra eventos mientras escribes
- **Filtros de Entradas**: Filtra por Todas, Activas, Pendientes, Pasadas
- **Navegación Intuitiva**: Navbar con enlaces rápidos
- **Feedback Visual**: Badges de colores según el estado
- **Confirmaciones**: Mensajes de confirmación antes de acciones importantes

## 🐛 Solución de Problemas

### Error de Conexión a MySQL

```bash
# Verificar que MySQL está corriendo
sudo systemctl status mysql  # Linux
brew services list           # Mac
net start MySQL              # Windows

# Verificar credenciales en .env
```

### Puerto 3000 en Uso

```bash
# Cambiar puerto en src/server.ts
const PORT = process.env.PORT || 3001;
```

### Error al Compilar

```bash
# Limpiar y reinstalar
rm -rf node_modules dist
npm install
npm run build
```

## 📚 Próximos Pasos

1. Crear eventos de prueba usando la API o directamente en la BD
2. Probar el flujo completo de reserva y pago
3. Probar la validación de entradas como admin
4. Explorar el código en `src/` para entender la arquitectura
5. Revisar el [README.md](README.md) completo para más detalles

## 🤝 Contribuir

Si encuentras bugs o tienes ideas de mejora:

1. Crea un issue
2. Haz un fork
3. Crea una rama con tu feature
4. Haz un pull request

## 📞 Soporte

Para preguntas o problemas, revisa:

- [README.md](README.md) - Documentación completa
- [database/schema.sql](database/schema.sql) - Estructura de BD
- Código fuente en `src/`

---

**¡Disfruta usando Manager de Eventos!** 🎉
