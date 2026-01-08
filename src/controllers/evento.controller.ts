import { Request, Response } from "express";
import * as eventoService from "../services/evento.service";

// export class EventoController {
//   constructor(private eventoService: EventoService) { }

export const crearEvento = async (req: Request, res: Response) => {
  try {
    const { nombre, fechaHora, cupoTotal } = req.body;

    if (!nombre || !fechaHora || typeof cupoTotal !== "number") {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const evento = await eventoService.crearEvento({
      nombre,
      fechaHora,
      cupoTotal,
    });

    return res.status(201).json(evento);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Error al crear evento" });
  }
};

export const listarEventos = async (_req: Request, res: Response) => {
  try {
    const eventos = await eventoService.listarEventos();
    return res.json(eventos);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Error al listar eventos" });
  }
};

export const obtenerEvento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const evento = await eventoService.obtenerEvento(id);
    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    return res.json(evento);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Error al obtener evento" });
  }
};
