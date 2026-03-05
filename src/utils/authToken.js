import jwt from 'jsonwebtoken';
import { InvalidTokenError } from '@/errors';
var isPlainObject = (value) => {
    return Object.prototype.toString.call(value) === '[object Object]';
};
export const signToken = (payload, options) => {
    jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
        ...options,
    });
};
export const verifyToken = (token) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (isPlainObject(payload)) {
            return payload;
        }
        throw new Error();
    }
    catch (err) {
        throw new InvalidTokenError();
    }
};
export const getAuthTokenFromRequest = (req) => {
    const header = req.get('Authorization');
    const [bearer, token] = header.split(" ");
    return bearer === 'Bearer' ? token : null;
};
//# sourceMappingURL=authToken.js.map