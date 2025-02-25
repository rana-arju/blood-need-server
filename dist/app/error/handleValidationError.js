"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (err) => {
    const errorMessages = Object.values(err).map((val) => {
        return {
            path: val?.path,
            message: val?.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: "validation error",
        errorMessages,
    };
};
exports.default = handleValidationError;
