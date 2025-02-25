"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const errorMessages = [
        {
            path: err.path,
            message: err?.message,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: "Cast error",
        errorMessages,
    };
};
exports.default = handleCastError;
