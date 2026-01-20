import { Request, Response } from "express";
import * as entradaService from '../services/entrada.service';

// export class EntradaController {
// constructor(private entradaService: EntradaService) { }

export const reservarEntrada = async (req: Request, res: Response) => {
  try {
    const { eventoId, cantidadLocalidades } = req.body;
    //const usuarioId = req.user?.id; // Obtener del JWT
    const usuarioId = '6fb2e5e8-be18-44e1-81fb-c14850f6e940'; // Temporalmente fijo para pruebas';

    // Validar autenticación
    if (!usuarioId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Validar datos
    if (!eventoId || typeof cantidadLocalidades !== "number") {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const entrada = await entradaService.reservarEntrada({
      eventoId,
      usuarioId,
      cantidadLocalidades,
    });

    return res.status(201).json(entrada);
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ message: err.message || "Error al reservar entrada" });
  }
};

export const pagarEntrada = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const entrada = await entradaService.pagarEntrada(id);
    return res.json(entrada);
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ message: err.message || "Error al pagar entrada" });
  }
};

export const validarEntrada = async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;
    const entrada = await entradaService.validarEntrada(codigo);
    return res.json(entrada);
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ message: err.message || "Error al validar entrada" });
  }
};

export const cancelarVencidas = async (_req: Request, res: Response) => {
  try {
    const resultado = await entradaService.cancelarEntradasVencidas();
    return res.json(resultado);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Error al cancelar entradas vencidas" });
  }
};

export const listarEntradas = async (_req: Request, res: Response) => {
  try {
    const entradas = await entradaService.listarEntradas();
    return res.json(entradas);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Error al listar entradas" });
  }
};

export const obtenerEntrada = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const entrada = await entradaService.obtenerEntrada(id);
    if (!entrada) {
      return res.status(404).json({ message: "Entrada no encontrada" });
    }
    return res.json(entrada);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Error al obtener entrada" });
  }
};
