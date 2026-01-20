import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../types/auth';
import { Usuario } from '../models/Usuario';
import { UsuarioEstado } from '../models/enums/usuarioEstado';
import { randomUUID } from 'crypto';
import { newDate } from '../utils/dateHelper';
import { UsuarioRol } from '../models/enums/usuarioRol';
import { getUsuarioModel } from '../config/RepositoryFactory';


if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no definido');
}

const secretKey: string = process.env.JWT_SECRET;

const generateId = (): string => randomUUID();

const usuarioModel = getUsuarioModel();

export const register = async (
    username: string,
    email: string,
    password: string,
    nombre: string,
    apellido: string,
    fechaNacimiento: string
): Promise<string> => {

    // Verificar si ya existe un usuario activo con ese email
    const existing = await usuarioModel.findByEmail(email);
    if (existing && existing.estado === UsuarioEstado.ACTIVO) {
        throw new Error("Ya existe un usuario activo con ese email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const ahora = newDate();
    const ahoraISO = ahora.toISOString();

    const usuario: Omit<Usuario, 'rol'> = {
        id: generateId(),
        password: hashedPassword,
        username,
        nombre,
        apellido,
        fechaNacimiento,
        email,
        estado: UsuarioEstado.ACTIVO,
        createdAt: ahoraISO,
        updatedAt: ahoraISO,
    };

    await usuarioModel.createUser(usuario);
    return usuario.id;
};

export const login = async (
    email: string,
    password: string
): Promise<string> => {
    const invalidCredentialsError = new Error('Credenciales inválidas');

    const usuarioDB = await usuarioModel.findByEmail(email);
    if (!usuarioDB) throw invalidCredentialsError;

    const isValid = await bcrypt.compare(password, usuarioDB.password);
    if (!isValid) throw invalidCredentialsError;

    /**
     * Payload del token JWT
     * Contiene la información básica del usuario
     */
    const payload: JwtPayload = {
        id: usuarioDB.id,
        role: usuarioDB.rol as UsuarioRol,
        username: usuarioDB.username,
    };

    /**
     * Configuración del token JWT
     * expiresIn: tiempo de expiración
     * issuer: emisor del token
     */
    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN as any) || '1h',
        issuer: 'curso-utn-backend',
    };

    /**
     * Generación del token JWT
     * Se firma el payload con el secreto y las opciones definidas
     */
    return jwt.sign(payload, secretKey, options);
};

export const listarUsuarios = async (): Promise<Usuario[]> => {
    return usuarioModel.findAll();
}

export const obtenerUsuario = async (username: string): Promise<Usuario | null> => {
    return usuarioModel.findByUsername(username);
}

export const obtenerUsuarioPorId = async (id: string): Promise<Usuario | null> => {
    return usuarioModel.findById(id);
}