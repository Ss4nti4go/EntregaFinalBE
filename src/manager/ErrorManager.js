export default class ErrorManager extends Error {
    constructor(message, code) {
        super(message);
        this.code = code || 500;
    }
    static handleError(error) {
        if(error.message==="ValidationError"){
            const messages = Object.values(error.errors).map(e => e.message);
            return new ErrorManager(messages.join(', ').trim(), 400);
        }
        throw new ErrorManager(error.message || 'Error del Servidor' ,500);
    }
}