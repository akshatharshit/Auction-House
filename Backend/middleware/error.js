
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
};

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal server error";
    err.statusCode = err.statusCode || 500;
    if (err.name === "jsonWebTokenError") {
        const message = "json wen token is  invalid try again";
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "TokenExpiredError") {
        const message = "json wen token is  expired try again";
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "CastError") {
        const message = `invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    const errorMessage = err.errors 
    ? Object.values(err.errors)
    .map((error) => error.message)
    .join(" ") 
    : err.message;

    return res.status(err.statusCode).json({
        message: errorMessage,
        success: false,
    });
};

export default ErrorHandler;
