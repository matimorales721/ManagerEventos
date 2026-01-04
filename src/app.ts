import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import path from "path";
import eventosRouter from "./routes/eventos.routes";
import usuariosRouter from "./routes/usuarios.routes";
import entradasRouter from "./routes/entradas.routes";
import viewsRouter from "./routes/views.routes";

const app = express();

// Configuración de Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials'),
    helpers: {
        eq: (a: any, b: any) => a === b,
        not: (value: any) => !value,
        formatDate: (date: string) => {
            if (!date) return '';
            const d = new Date(date);
            return d.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        formatDateOnly: (date: string) => {
            if (!date) return '';
            const d = new Date(date);
            return d.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Sesión
app.use(session({
    secret: 'manager-eventos-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // En producción usar true con HTTPS
}));

// Middleware para parsear JSON y form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Routes (deben ir primero para capturar rutas raíz)
app.use("/", viewsRouter);

// API Routes
app.use("/eventos", eventosRouter);
app.use("/usuarios", usuariosRouter);
app.use("/entradas", entradasRouter);

export default app;
