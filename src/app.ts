import express from "express";
import eventosRouter from "./routes/eventos.routes";
import usuariosRouter from "./routes/usuarios.routes";
import entradasRouter from "./routes/entradas.routes";

const app = express();

app.use(express.json());

app.use("/eventos", eventosRouter);
app.use("/usuarios", usuariosRouter);
app.use("/entradas", entradasRouter);

export default app;
