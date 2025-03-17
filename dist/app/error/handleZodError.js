"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    const errorMessages = error.issues.map((issue) => ({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
    }));
    const statusCode = 400;
    return {
        statusCode,
        message: "Validation error",
        errorMessages,
    };
};
exports.default = handleZodError;
