export class CustomError extends Error {
    constructor(message, code = 'INTERNAL_ERROR', status = 500, data = {}) {
        super();
        this.message = message;
        this.code = code;
        this.status = status;
        this.data = data;
    }
}
export class InvalidTokenError extends CustomError {
    constructor(message = "Authentication token is invalid.") {
        super(message, "INVALID_TOKEN", 401);
    }
}
//# sourceMappingURL=customErrors.js.map