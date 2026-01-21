import mongoose, { Schema, Document } from 'mongoose';
import { UsuarioEstado } from '../../../enums/usuarioEstado';
import { IUsuario } from '../../../types/Usuario';
import { UsuarioRol } from '../../../enums/usuarioRol';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    birthday: Date;
    role?: UsuarioRol;
    state: UsuarioEstado;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido'],
        },
        password: { type: String, required: true, minlength: 8 },
        state: { type: String, enum: Object.values(UsuarioEstado), default: UsuarioEstado.ACTIVO } as any,
        role: { type: String, enum: Object.values(UsuarioRol), default: UsuarioRol.NORMAL } as any,
        birthday: { type: Date, required: true },
        name: { type: String, required: true, trim: true },
        surname: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);

export const findById = async (
    id: string = '',
): Promise<IUsuario | null> => {

    const usuarioDB = await User.findById(id).lean();
    if (!usuarioDB) return null;

    const usuario: IUsuario = {
        id: usuarioDB._id.toString(),
        username: usuarioDB.username,
        email: usuarioDB.email,
        password: usuarioDB.password,
        rol: usuarioDB.role,
        nombre: usuarioDB.name,
        apellido: usuarioDB.surname,
        fechaNacimiento: usuarioDB.birthday.toISOString(),
        estado: usuarioDB.state,
        createdAt: usuarioDB.createdAt.toISOString(),
        updatedAt: usuarioDB.updatedAt.toISOString(),
    }
    return usuario;
};

export const findByEmail = async (
    email: string = '',
): Promise<IUsuario | null> => {
    const [usuarioDB] = await User.find({ email: email }).lean();
    if (!usuarioDB) return null;

    const usuario: IUsuario = {
        id: usuarioDB._id.toString(),
        username: usuarioDB.username,
        email: usuarioDB.email,
        password: usuarioDB.password,
        rol: usuarioDB.role,
        nombre: usuarioDB.name,
        apellido: usuarioDB.surname,
        fechaNacimiento: usuarioDB.birthday.toISOString(),
        estado: usuarioDB.state,
        createdAt: usuarioDB.createdAt.toISOString(),
        updatedAt: usuarioDB.updatedAt.toISOString(),
    }
    return usuario;
};

export const createUser = async (
    user: Omit<IUsuario, 'id'>
): Promise<void> => {

    const usuarioData: Partial<IUser> = {
        username: user.username,
        email: user.email,
        password: user.password,
        state: user.estado,
        role: user.rol,
        name: user.nombre,
        surname: user.apellido,
        birthday: user.fechaNacimiento ? new Date(user.fechaNacimiento) : undefined,
    };

    const newUser = new User(usuarioData);
    await newUser.save();
};
