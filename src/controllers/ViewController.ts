import { Request, Response } from "express";
import { EventoService } from "../services/EventoService";
import { EntradaService } from "../services/EntradaService";
import { EntradaEstado } from "../models/enums/entradaEstado";
import { UsuarioRol } from "../models/enums/usuarioRol";

export class ViewController {
    constructor(private eventoService: EventoService, private entradaService: EntradaService) { }

    // Precio simulado por localidad
    private readonly PRECIO_POR_LOCALIDAD = 5000;

    // Helper para calcular localidades ocupadas
    private async calcularLocalidadesOcupadas(eventoId: string): Promise<number> {
        const entradas = await this.entradaService.listarEntradas();
        return entradas
            .filter(
                (e) =>
                    e.eventoId === eventoId &&
                    (e.estado === EntradaEstado.NUEVA ||
                        e.estado === EntradaEstado.ACTIVA ||
                        e.estado === EntradaEstado.UTILIZADA)
            )
            .reduce((sum, e) => sum + e.cantidadLocalidades, 0);
    }

    // HOME - Lista de eventos
    async home(req: Request, res: Response) {
        try {
            let eventos = await this.eventoService.listarEventos();
            const filtro = req.query.filtro as string;

            // Filtrar por estado si se especifica
            if (filtro && filtro !== "TODOS") {
                eventos = eventos.filter((e) => e.estado === filtro);
            }

            // Ordenar eventos: Activos primero por fecha ascendente, luego finalizados/cancelados
            eventos.sort((a, b) => {
                if (a.estado === "ACTIVO" && b.estado !== "ACTIVO") return -1;
                if (a.estado !== "ACTIVO" && b.estado === "ACTIVO") return 1;
                return new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime();
            });

            res.render("home", {
                eventos,
                filtroActual: filtro || "TODOS",
                user: req.user,
                isHome: true,
                pageTitle: "Inicio",
            });
        } catch (error: any) {
            res.status(500).render("error", {
                message: "Error al cargar eventos",
                error: error.message,
                user: req.user,
            });
        }
    }

    // EVENTO DETALLE
    async eventoDetalle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const evento = await this.eventoService.obtenerEvento(id);

            if (!evento) {
                return res.status(404).render("error", {
                    message: "Evento no encontrado",
                    user: req.user,
                });
            }

            // Calcular disponibilidad
            const ocupadas = await this.calcularLocalidadesOcupadas(evento.id);
            const disponibles = evento.cupoTotal - ocupadas;

            res.render("evento", {
                evento,
                ocupadas,
                disponibles,
                user: req.user,
                pageTitle: evento.nombre,
            });
        } catch (error: any) {
            res.status(500).render("error", {
                message: "Error al cargar evento",
                error: error.message,
                user: req.user,
            });
        }
    }

    // FORMULARIO RESERVAR ENTRADA
    async formReservarEntrada(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const evento = await this.eventoService.obtenerEvento(id);

            if (!evento) {
                return res.status(404).render("error", {
                    message: "Evento no encontrado",
                    user: req.user,
                });
            }

            // Calcular disponibilidad
            const ocupadas = await this.calcularLocalidadesOcupadas(evento.id);
            const disponibles = evento.cupoTotal - ocupadas;

            res.render("reservar-entrada", {
                evento,
                disponibles,
                user: req.user,
                pageTitle: `Reservar - ${evento.nombre}`,
            });
        } catch (error: any) {
            res.status(500).render("error", {
                message: "Error al cargar formulario",
                error: error.message,
                user: req.user,
            });
        }
    }

    // PROCESAR RESERVA
    async procesarReserva(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { cantidadLocalidades } = req.body;
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).render("error", {
                    message: "Usuario no autenticado",
                    user: req.user,
                });
            }

            const evento = await this.eventoService.obtenerEvento(id);
            if (!evento) {
                return res.status(404).render("error", {
                    message: "Evento no encontrado",
                    user: req.user,
                });
            }

            // Reservar entrada
            const entrada = await this.entradaService.reservarEntrada({
                eventoId: id,
                usuarioId,
                cantidadLocalidades: parseInt(cantidadLocalidades),
            });

            res.render("reserva-confirmada", {
                entrada,
                evento,
                user: req.user,
                pageTitle: "Reserva Confirmada",
            });
        } catch (error: any) {
            res.status(400).render("error", {
                message: "Error al procesar reserva",
                error: error.message,
                user: req.user,
            });
        }
    }

    // FORMULARIO PAGAR ENTRADA
    async formPagarEntrada(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const entrada = await this.entradaService.obtenerEntrada(id);

            if (!entrada) {
                return res.status(404).render("error", {
                    message: "Entrada no encontrada",
                    user: req.user,
                });
            }

            // Verificar que la entrada pertenece al usuario
            if (entrada.usuarioId !== req.user?.id) {
                return res.status(403).render("error", {
                    message: "No tienes permisos para ver esta entrada",
                    user: req.user,
                });
            }

            const evento = await this.eventoService.obtenerEvento(entrada.eventoId);
            if (!evento) {
                return res.status(404).render("error", {
                    message: "Evento no encontrado",
                    user: req.user,
                });
            }

            const precioTotal = entrada.cantidadLocalidades * this.PRECIO_POR_LOCALIDAD;

            res.render("pagar-entrada", {
                entrada,
                evento,
                precioTotal: precioTotal.toLocaleString("es-AR"),
                user: req.user,
                pageTitle: "Pagar Entrada",
            });
        } catch (error: any) {
            res.status(500).render("error", {
                message: "Error al cargar página de pago",
                error: error.message,
                user: req.user,
            });
        }
    }

    // PROCESAR PAGO
    async procesarPago(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const entrada = await this.entradaService.obtenerEntrada(id);

            if (!entrada) {
                return res.status(404).render("error", {
                    message: "Entrada no encontrada",
                    user: req.user,
                });
            }

            // Verificar que la entrada pertenece al usuario
            if (entrada.usuarioId !== req.user?.id) {
                return res.status(403).render("error", {
                    message: "No tienes permisos para pagar esta entrada",
                    user: req.user,
                });
            }

            const entradaPagada = await this.entradaService.pagarEntrada(id);
            const evento = await this.eventoService.obtenerEvento(entradaPagada.eventoId);

            if (!evento) {
                return res.status(404).render("error", {
                    message: "Evento no encontrado",
                    user: req.user,
                });
            }

            const precioTotal = entradaPagada.cantidadLocalidades * this.PRECIO_POR_LOCALIDAD;

            res.render("pago-confirmado", {
                entrada: entradaPagada,
                evento,
                precioTotal: precioTotal.toLocaleString("es-AR"),
                user: req.user,
                pageTitle: "Pago Confirmado",
            });
        } catch (error: any) {
            res.status(400).render("error", {
                message: "Error al procesar pago",
                error: error.message,
                user: req.user,
            });
        }
    }

    // MIS ENTRADAS
    async misEntradas(req: Request, res: Response) {
        try {
            const usuarioId = req.user?.id;

            if (!usuarioId) {
                return res.status(401).render("error", {
                    message: "Usuario no autenticado",
                    user: req.user,
                });
            }

            const entradasUsuario = await this.entradaService.listarEntradasPorUsuario(usuarioId);

            // Enriquecer con datos del evento
            const entradasConEvento = await Promise.all(
                entradasUsuario.map(async (entrada) => {
                    const evento = await this.eventoService.obtenerEvento(entrada.eventoId);
                    return { ...entrada, evento };
                })
            );

            res.render("mis-entradas", {
                entradas: entradasConEvento,
                user: req.user,
                isMisEntradas: true,
                pageTitle: "Mis Entradas",
            });
        } catch (error: any) {
            res.status(500).render("error", {
                message: "Error al cargar entradas",
                error: error.message,
                user: req.user,
            });
        }
    }

    // ENTRADA DETALLE
    async entradaDetalle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const entrada = await this.entradaService.obtenerEntrada(id);

            if (!entrada) {
                return res.status(404).render("error", {
                    message: "Entrada no encontrada",
                    user: req.user,
                });
            }

            // Verificar que la entrada pertenece al usuario
            if (entrada.usuarioId !== req.user?.id) {
                return res.status(403).render("error", {
                    message: "No tienes permisos para ver esta entrada",
                    user: req.user,
                });
            }

            const evento = await this.eventoService.obtenerEvento(entrada.eventoId);
            if (!evento) {
                return res.status(404).render("error", {
                    message: "Evento no encontrado",
                    user: req.user,
                });
            }

            res.render("entrada-detalle", {
                entrada,
                evento,
                user: req.user,
                pageTitle: "Entrada",
            });
        } catch (error: any) {
            res.status(500).render("error", {
                message: "Error al cargar entrada",
                error: error.message,
                user: req.user,
            });
        }
    }

    // VALIDAR ENTRADAS (ADMIN)
    async formValidarEntradas(req: Request, res: Response) {
        try {
            // Verificar que es admin
            if (req.user?.rol !== UsuarioRol.ADMIN) {
                return res.status(403).render("validar-entradas", {
                    user: req.user,
                    isValidar: true,
                    pageTitle: "Validar Entradas",
                });
            }

            const eventos = await this.eventoService.listarEventos();
            const selectedEventoId = req.query.eventoId as string;

            res.render("validar-entradas", {
                eventos,
                selectedEventoId,
                user: req.user,
                isValidar: true,
                pageTitle: "Validar Entradas",
            });
        } catch (error: any) {
            res.status(500).render("error", {
                message: "Error al cargar formulario",
                error: error.message,
                user: req.user,
            });
        }
    }

    // BUSCAR ENTRADA PARA VALIDAR
    async buscarEntradaValidar(req: Request, res: Response) {
        try {
            // Verificar que es admin
            if (req.user?.rol !== UsuarioRol.ADMIN) {
                return res.status(403).render("error", {
                    message: "Solo administradores pueden validar entradas",
                    user: req.user,
                });
            }

            const { eventoId, codigoEntrada } = req.body;
            const codigo = `ENT-${codigoEntrada}`;

            const eventos = await this.eventoService.listarEventos();
            const evento = await this.eventoService.obtenerEvento(eventoId);

            if (!evento) {
                return res.status(404).render("validar-entradas", {
                    eventos,
                    error: "Evento no encontrado",
                    selectedEventoId: eventoId,
                    user: req.user,
                    isValidar: true,
                });
            }

            const entrada = await this.entradaService.obtenerEntradaPorCodigo(codigo);

            if (!entrada) {
                return res.status(404).render("validar-entradas", {
                    eventos,
                    selectedEventoId: eventoId,
                    error: "Entrada no encontrada",
                    user: req.user,
                    isValidar: true,
                });
            }

            // Verificar que la entrada corresponde al evento seleccionado
            if (entrada.eventoId !== eventoId) {
                return res.render("validar-entradas", {
                    eventos,
                    selectedEventoId: eventoId,
                    error: "Esta entrada no corresponde al evento seleccionado",
                    user: req.user,
                    isValidar: true,
                });
            }

            const precioTotal = entrada.cantidadLocalidades * this.PRECIO_POR_LOCALIDAD;

            res.render("validar-entradas", {
                eventos,
                entrada,
                evento,
                precioTotal: precioTotal.toLocaleString("es-AR"),
                selectedEventoId: eventoId,
                user: req.user,
                isValidar: true,
                pageTitle: "Validar Entradas",
            });
        } catch (error: any) {
            res.status(500).render("error", {
                message: "Error al buscar entrada",
                error: error.message,
                user: req.user,
            });
        }
    }

    // VALIDAR ENTRADA
    async validarEntrada(req: Request, res: Response) {
        try {
            // Verificar que es admin
            if (req.user?.rol !== UsuarioRol.ADMIN) {
                return res.status(403).render("error", {
                    message: "Solo administradores pueden validar entradas",
                    user: req.user,
                });
            }

            const { codigo } = req.params;
            const { eventoId } = req.body;

            const entradaValidada = await this.entradaService.validarEntrada(codigo);
            const eventoValidado = await this.eventoService.obtenerEvento(entradaValidada.eventoId);
            const eventos = await this.eventoService.listarEventos();

            if (!eventoValidado) {
                return res.status(404).render("error", {
                    message: "Evento no encontrado",
                    user: req.user,
                });
            }

            const precioTotalValidado = entradaValidada.cantidadLocalidades * this.PRECIO_POR_LOCALIDAD;

            res.render("validar-entradas", {
                eventos,
                entradaValidada,
                eventoValidado,
                precioTotalValidado: precioTotalValidado.toLocaleString("es-AR"),
                selectedEventoId: eventoId,
                user: req.user,
                isValidar: true,
                pageTitle: "Entrada Validada",
            });
        } catch (error: any) {
            res.status(400).render("error", {
                message: "Error al validar entrada",
                error: error.message,
                user: req.user,
            });
        }
    }
}
