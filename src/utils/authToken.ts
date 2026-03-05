import { Request } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { InvalidTokenError } from '@/errors';

var isPlainObject = (value: any) => {
    return Object.prototype.toString.call(value) === '[object Object]';
}

export const signToken = (payload: object, options?: SignOptions): string => {
    jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
        ...options,
    })
}

export const verifyToken = (token: string): { [key: string]: any } => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if(isPlainObject(payload)) {
            return payload as { [key:string]: any };

        }
        throw new Error();
    } catch (err) {
        throw new InvalidTokenError();
    }
}

export const getAuthTokenFromRequest = (req: Request): string | null => {
    const header = req.get('Authorization');
    if(header != undefined) {
        const [bearer, token] = header.split(" ");
        return bearer === 'Bearer' ? token : null;
    }
    return null;
}