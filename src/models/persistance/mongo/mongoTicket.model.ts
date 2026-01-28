import mongoose, { Schema, Document } from 'mongoose';
import { UsuarioEstado } from '../../../enums/usuarioEstado';
import { IUsuario } from '../../../types/Usuario';
import { UsuarioRol } from '../../../enums/usuarioRol';
import { IEntrada } from '../../../types/Entrada';
import { EntradaEstado } from '../../../enums/entradaEstado';

export interface ITicket extends Document {
    code: string;
    eventId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    quantity: number;
    state: EntradaEstado;
    reservationDate: Date;
    paymentDate?: Date;
    usageDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        reservationDate: { type: Date, required: true },
        paymentDate: { type: Date },
        usageDate: { type: Date },
        // stateId: { ref: 'TicketState', type: Schema.Types.ObjectId, required: true },
        state: { type: String, enum: Object.values(EntradaEstado), default: EntradaEstado.NUEVA } as any,
        eventId: { ref: 'Event', type: Schema.Types.ObjectId, required: true },
        userId: { ref: 'User', type: Schema.Types.ObjectId, required: true },
    },
    { timestamps: true }
);

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);

export const findById = async (
    id: string = '',
): Promise<IEntrada | null> => {
    const [entradaDB] = await Ticket.find({ _id: id }).lean();
    if (!entradaDB) return null;

    const entrada: IEntrada = {
        id: entradaDB._id.toString(),
        codigo: entradaDB.code,
        eventoId: entradaDB.eventId._id.toString(),
        usuarioId: entradaDB.userId._id.toString(),
        cantidadLocalidades: entradaDB.quantity,
        estado: entradaDB.state as EntradaEstado,
        fechaReserva: entradaDB.reservationDate.toISOString(),
        fechaPago: entradaDB.paymentDate ? entradaDB.paymentDate.toISOString() : undefined,
        fechaUso: entradaDB.usageDate ? entradaDB.usageDate.toISOString() : undefined,
        createdAt: entradaDB.createdAt.toISOString(),
        updatedAt: entradaDB.updatedAt.toISOString(),
    }
    return entrada;
};

export const findAll = async (
): Promise<IEntrada[]> => {
    const entradasDB = await Ticket.find().lean();
    const entradas: IEntrada[] = entradasDB.map((entradaDB) => ({
        id: entradaDB._id.toString(),
        codigo: entradaDB.code,
        eventoId: entradaDB.eventId.toString(),
        usuarioId: entradaDB.userId.toString(),
        cantidadLocalidades: entradaDB.quantity,
        estado: entradaDB.state as EntradaEstado,
        fechaReserva: entradaDB.reservationDate.toISOString(),
        fechaPago: entradaDB.paymentDate ? entradaDB.paymentDate.toISOString() : undefined,
        fechaUso: entradaDB.usageDate ? entradaDB.usageDate.toISOString() : undefined,
        createdAt: entradaDB.createdAt.toISOString(),
        updatedAt: entradaDB.updatedAt.toISOString(),
    }));
    return entradas;
};


export const save = async (entrada: IEntrada): Promise<string> => {
    const newTicket = new Ticket({
        code: entrada.codigo,
        eventId: new mongoose.Types.ObjectId(entrada.eventoId),
        userId: new mongoose.Types.ObjectId(entrada.usuarioId),
        quantity: entrada.cantidadLocalidades,
        // stateId: entrada.estado,
        reservationDate: new Date(entrada.fechaReserva),
        paymentDate: entrada.fechaPago ? new Date(entrada.fechaPago) : undefined,
        usageDate: entrada.fechaUso ? new Date(entrada.fechaUso) : undefined,
    });
    await newTicket.save();
    return newTicket._id.toString();
};

export const findByEventoId = async (
    eventoId: string = '',
): Promise<IEntrada[]> => {
    const entradasDB = await Ticket.find({ eventId: eventoId }).lean();
    const entradas: IEntrada[] = entradasDB.map((entradaDB) => ({
        id: entradaDB._id.toString(),
        codigo: entradaDB.code,
        eventoId: entradaDB.eventId.toString(),
        usuarioId: entradaDB.userId.toString(),
        cantidadLocalidades: entradaDB.quantity,
        estado: entradaDB.state as EntradaEstado,
        fechaReserva: entradaDB.reservationDate.toISOString(),
        fechaPago: entradaDB.paymentDate ? entradaDB.paymentDate.toISOString() : undefined,
        fechaUso: entradaDB.usageDate ? entradaDB.usageDate.toISOString() : undefined,
        createdAt: entradaDB.createdAt.toISOString(),
        updatedAt: entradaDB.updatedAt.toISOString(),
    }));
    return entradas;
};

export const update = async (entrada: IEntrada): Promise<void> => {
    await Ticket.updateOne(
        { _id: entrada.id },
        {
            code: entrada.codigo,
            eventId: new mongoose.Types.ObjectId(entrada.eventoId),
            userId: new mongoose.Types.ObjectId(entrada.usuarioId),
            quantity: entrada.cantidadLocalidades,
            state: entrada.estado,
            reservationDate: new Date(entrada.fechaReserva),
            paymentDate: entrada.fechaPago ? new Date(entrada.fechaPago) : undefined,
            usageDate: entrada.fechaUso ? new Date(entrada.fechaUso) : undefined,
        }
    );
};

export const findByUsuarioId = async (
    usuarioId: string = '',
): Promise<IEntrada[]> => {
    const entradasDB = await Ticket.find({ userId: usuarioId }).lean();
    const entradas: IEntrada[] = entradasDB.map((entradaDB) => ({
        id: entradaDB._id.toString(),
        codigo: entradaDB.code,
        eventoId: entradaDB.eventId.toString(),
        usuarioId: entradaDB.userId.toString(),
        cantidadLocalidades: entradaDB.quantity,
        estado: entradaDB.state as EntradaEstado,
        fechaReserva: entradaDB.reservationDate.toISOString(),
        fechaPago: entradaDB.paymentDate ? entradaDB.paymentDate.toISOString() : undefined,
        fechaUso: entradaDB.usageDate ? entradaDB.usageDate.toISOString() : undefined,
        createdAt: entradaDB.createdAt.toISOString(),
        updatedAt: entradaDB.updatedAt.toISOString(),
    }));
    return entradas;
};

export const findByCodigo = async (
    codigo: string = '',
): Promise<IEntrada | null> => {
    const [entradaDB] = await Ticket.find({ code: codigo }).lean();
    if (!entradaDB) return null;
    const entrada: IEntrada = {
        id: entradaDB._id.toString(),
        codigo: entradaDB.code,
        eventoId: entradaDB.eventId.toString(),
        usuarioId: entradaDB.userId.toString(),
        cantidadLocalidades: entradaDB.quantity,
        estado: entradaDB.state as EntradaEstado,
        fechaReserva: entradaDB.reservationDate.toISOString(),
        fechaPago: entradaDB.paymentDate ? entradaDB.paymentDate.toISOString() : undefined,
        fechaUso: entradaDB.usageDate ? entradaDB.usageDate.toISOString() : undefined,
        createdAt: entradaDB.createdAt.toISOString(),
        updatedAt: entradaDB.updatedAt.toISOString(),
    }
    return entrada;
};