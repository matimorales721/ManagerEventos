import mongoose, { Schema, Document } from 'mongoose';
import { IEvento } from '../../../types/Evento';


export interface IEvent extends Document {
    code: string;
    title: string;
    description: string;
    dateTime: Date;
    totalCapacity: number;
    imageUrl?: string;
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
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        dateTime: { type: Date, required: true },
        totalCapacity: { type: Number, required: true, min: 1 },
        imageUrl: { type: String },
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
        titulo: eventoDB.title,
        descripcion: eventoDB.description,
        fechaHora: eventoDB.dateTime.toISOString(),
        cupoTotal: eventoDB.totalCapacity,
        imagenUrl: eventoDB.imageUrl,
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
        titulo: eventoDB.title,
        descripcion: eventoDB.description,
        fechaHora: eventoDB.dateTime.toISOString(),
        cupoTotal: eventoDB.totalCapacity,
        imagenUrl: eventoDB.imageUrl,
        estado: eventoDB.state?.toString() as any,
        createdAt: eventoDB.createdAt.toISOString(),
        updatedAt: eventoDB.updatedAt.toISOString(),
    }));
};

export const agregarEvento = async (evento: IEvento): Promise<string> => {
    const newEvent = new Event({
        code: evento.codigo,
        title: evento.titulo,
        description: evento.descripcion,
        dateTime: new Date(evento.fechaHora),
        totalCapacity: evento.cupoTotal,
        imageUrl: evento.imagenUrl,
    });
    await newEvent.save();
    return newEvent._id.toString();
}