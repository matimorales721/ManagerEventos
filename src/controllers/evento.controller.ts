import { Request, Response } from "express";
import * as eventoService from "../services/evento.service";
import fs from "fs";

export const crearEvento = async (req: Request, res: Response) => {
  try {
    const { titulo, descripcion, fechaHora } = req.body;

    // Convertir cupoTotal a número (FormData lo envía como string)
    const cupoTotal = parseInt(req.body.cupoTotal, 10);

    if (!titulo || !descripcion || !fechaHora || !cupoTotal || cupoTotal < 1) {
      // Si hay error de validación y se subió imagen, eliminarla
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Datos inválidos" });
    }

    // Si se subió una imagen, multer la guarda y pone info en req.file
    const imagenUrl = req.file
      ? `/images/eventos/${req.file.filename}`
      : undefined;

    const evento = await eventoService.crearEvento({
      titulo,
      descripcion,
      fechaHora,
      cupoTotal,
      imagenUrl,
    });

    return res.status(201).json(evento);
  } catch (err: any) {
    console.error(err);
    // Si hubo error, eliminar imagen si se subió
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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
