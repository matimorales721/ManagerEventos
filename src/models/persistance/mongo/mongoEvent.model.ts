import mongoose, { Schema, Document } from 'mongoose';
import { IEvento } from '../../../types/Evento';


export interface IEvent extends Document {
    code: string;
    name: string;
    dateTime: Date;
    totalCapacity: number;
    state: string;
    createdAt: Date;
    updatedAt: Date;
}



const eventSchema = new Schema<IEvent>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
        },
        dateTime: { type: Date, required: true },
        totalCapacity: { type: Number, required: true, min: 1 },
        state: { type: String, enum: [], default: 'ACTIVO' } as any,
    },
    { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', eventSchema);

export const findById = async (
    id: string = '',
): Promise<IEvento | null> => {
    const [eventoDB] = await Event.find({ _id: id }).lean();
    if (!eventoDB) return null;

    const evento: IEvento = {
        id: eventoDB._id.toString(),
        codigo: eventoDB.code,
        nombre: eventoDB.name,
        fechaHora: eventoDB.dateTime.toISOString(),
        cupoTotal: eventoDB.totalCapacity,
        estado: eventoDB.state?.toString() as any,
        createdAt: eventoDB.createdAt.toISOString(),
        updatedAt: eventoDB.updatedAt.toISOString(),
    };
    return evento;
};

export const findAll = async (): Promise<IEvento[]> => {
    const eventosDB = await Event.find().lean();
    return eventosDB.map((eventoDB) => ({
        id: eventoDB._id.toString(),
        codigo: eventoDB.code,
        nombre: eventoDB.name,
        fechaHora: eventoDB.dateTime.toISOString(),
        cupoTotal: eventoDB.totalCapacity,
        estado: eventoDB.state?.toString() as any,
        createdAt: eventoDB.createdAt.toISOString(),
        updatedAt: eventoDB.updatedAt.toISOString(),
    }));
};

export const agregarEvento = async (evento: IEvento): Promise<void> => {
    const newEvent = new Event({
        code: evento.codigo,
        name: evento.nombre,
        dateTime: new Date(evento.fechaHora),
        totalCapacity: evento.cupoTotal,
    });
    await newEvent.save();
}