import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import "dotenv/config";

import { initialize as initializeRepositories } from "./config/RepositoryFactory";
// Inicializar los repositorios según la configuración
initializeRepositories();

import eventosRouter from "./routes/eventos.routes";
import entradasRouter from "./routes/entradas.routes";
import viewsRouter from "./routes/views.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

const PORT = process.env.PORT || 3000;

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

// Middleware para parsear JSON y form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Routes (deben ir primero para capturar rutas raíz)
app.use("/", viewsRouter);

// API Routes
app.use("/api/eventos", eventosRouter);
app.use("/api/entradas", entradasRouter);
app.use('/api/auth', authRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`--------------------------------`);
    console.log(`Manager Eventos se encuentra corriendo en http://localhost:${PORT} 🚀`);
    console.log(`--------------------------------`);
});