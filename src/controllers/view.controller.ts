import { Request, Response } from "express";
import * as eventoService from "../services/evento.service";
import * as entradaService from "../services/entrada.service";
import { EntradaEstado } from "../enums/entradaEstado";
import { UsuarioRol } from "../enums/usuarioRol";


// Precio simulado por localidad
const PRECIO_POR_LOCALIDAD = 5000;

// Helper para calcular localidades ocupadas
const calcularLocalidadesOcupadas = async (eventoId: string): Promise<number> => {
    return await eventoService.calcularLocalidadesOcupadas(eventoId);
}

// HOME - Lista de eventos
export const home = async (req: Request, res: Response) => {
    try {
        let eventos = await eventoService.listarEventos();
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
export const eventoDetalle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const evento = await eventoService.obtenerEvento(id);

        if (!evento) {
            return res.status(404).render("error", {
                message: "Evento no encontrado",
                user: req.user,
            });
        }

        // Calcular disponibilidad
        const ocupadas = await eventoService.calcularLocalidadesOcupadas(evento.id);
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
export const formReservarEntrada = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const evento = await eventoService.obtenerEvento(id);

        if (!evento) {
            return res.status(404).render("error", {
                message: "Evento no encontrado",
                user: req.user,
            });
        }

        // Calcular disponibilidad
        const ocupadas = await eventoService.calcularLocalidadesOcupadas(evento.id);
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

// FORMULARIO PAGAR ENTRADA
export const formPagarEntrada = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const entrada = await entradaService.obtenerEntrada(id);

        if (!entrada) {
            return res.status(404).render("error", {
                message: "Entrada no encontrada",
                user: req.user,
            });
        }

        // Verificar que la entrada pertenece al usuario
        //const usuarioLogueadoId = req.user?.id;
        const usuarioLogueadoId = '6fb2e5e8-be18-44e1-81fb-c14850f6e940'; // Simulado

        if (entrada.usuarioId !== usuarioLogueadoId) {
            return res.status(403).render("error", {
                message: "No tienes permisos para ver esta entrada",
                user: req.user,
            });
        }

        const evento = await eventoService.obtenerEvento(entrada.eventoId);
        if (!evento) {
            return res.status(404).render("error", {
                message: "Evento no encontrado",
                user: req.user,
            });
        }

        const precioTotal = entrada.cantidadLocalidades * PRECIO_POR_LOCALIDAD;

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

// MIS ENTRADAS
export const misEntradas = async (req: Request, res: Response) => {
    try {
        //const usuarioId = req.user?.id;

        console.log('Usuario en misEntradas:', req.user);
        const usuarioId = '6fb2e5e8-be18-44e1-81fb-c14850f6e940';

        if (!usuarioId) {
            return res.status(401).render("error", {
                message: "Usuario no autenticado",
                user: req.user,
            });
        }

        const entradasUsuario = await entradaService.listarEntradasPorUsuario(usuarioId);

        // Enriquecer con datos del evento
        const entradasConEvento = await Promise.all(
            entradasUsuario.map(async (entrada) => {
                const evento = await eventoService.obtenerEvento(entrada.eventoId);
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
export const entradaDetalle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const entrada = await entradaService.obtenerEntrada(id);

        if (!entrada) {
            return res.status(404).render("error", {
                message: "Entrada no encontrada",
                user: req.user,
            });
        }

        // Verificar que la entrada pertenece al usuario
        const usuarioLogueadoId = req.user?.id;
        //const usuarioLogueadoId = '6fb2e5e8-be18-44e1-81fb-c14850f6e940'; // Simulado

        if (entrada.usuarioId !== usuarioLogueadoId) {
            return res.status(403).render("error", {
                message: "No tienes permisos para ver esta entrada",
                user: req.user,
            });
        }

        const evento = await eventoService.obtenerEvento(entrada.eventoId);
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
export const formValidarEntradas = async (req: Request, res: Response) => {
    try {
        const eventos = await eventoService.listarEventos();
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
export const buscarEntradaValidar = async (req: Request, res: Response) => {
    try {
        const { eventoId, codigoEntrada } = req.body;
        const codigo = `ENT-${codigoEntrada}`;

        const eventos = await eventoService.listarEventos();
        const evento = await eventoService.obtenerEvento(eventoId);

        if (!evento) {
            return res.status(404).render("validar-entradas", {
                eventos,
                error: "Evento no encontrado",
                selectedEventoId: eventoId,
                user: req.user,
                isValidar: true,
            });
        }

        const entrada = await entradaService.obtenerEntradaPorCodigo(codigo);

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

        const precioTotal = entrada.cantidadLocalidades * PRECIO_POR_LOCALIDAD;

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



// FORMULARIO DE LOGIN
export const formLogin = (req: Request, res: Response) => {
    res.render("login", {
        pageTitle: "Iniciar Sesión",
    });
};

// FORMULARIO DE REGISTRO
export const formRegister = (req: Request, res: Response) => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const maxDate = eighteenYearsAgo.toISOString().split('T')[0];

    res.render("register", {
        maxDate,
        pageTitle: "Registro de Usuario",
    });
};