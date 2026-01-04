import { Request, Response } from "express";
import { EntradaService } from "../services/EntradaService";

export class EntradaController {
  constructor(private entradaService: EntradaService) {}

  reservarEntrada = async (req: Request, res: Response) => {
    try {
      const { eventoId, usuarioId, cantidadLocalidades } = req.body;

      if (!eventoId || !usuarioId || typeof cantidadLocalidades !== "number") {
        return res.status(400).json({ message: "Datos inválidos" });
      }

      const entrada = await this.entradaService.reservarEntrada({
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

  pagarEntrada = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const entrada = await this.entradaService.pagarEntrada(id);
      return res.json(entrada);
    } catch (err: any) {
      console.error(err);
      return res.status(400).json({ message: err.message || "Error al pagar entrada" });
    }
  };

  validarEntrada = async (req: Request, res: Response) => {
    try {
      const { codigo } = req.params;
      const entrada = await this.entradaService.validarEntrada(codigo);
      return res.json(entrada);
    } catch (err: any) {
      console.error(err);
      return res.status(400).json({ message: err.message || "Error al validar entrada" });
    }
  };

  cancelarVencidas = async (_req: Request, res: Response) => {
    try {
      const resultado = await this.entradaService.cancelarEntradasVencidas();
      return res.json(resultado);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Error al cancelar entradas vencidas" });
    }
  };

  listarEntradas = async (_req: Request, res: Response) => {
    try {
      const entradas = await this.entradaService.listarEntradas();
      return res.json(entradas);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Error al listar entradas" });
    }
  };

  obtenerEntrada = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const entrada = await this.entradaService.obtenerEntrada(id);
      if (!entrada) {
        return res.status(404).json({ message: "Entrada no encontrada" });
      }
      return res.json(entrada);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Error al obtener entrada" });
    }
  };
}
