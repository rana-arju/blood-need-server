"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    const errorMessages = error.errors.map((err) => {
        return {
            path: err.path.join("."),
            message: err.message,
        };
    });
    return {
        statusCode: 400,
        message: "Validation Error",
        errorMessages,
    };
};
exports.default = handleZodError;
