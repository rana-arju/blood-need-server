"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    const errorMessages = error.issues.map((issue) => ({
        path: issue.path.join("."), // Join path array into a string
        message: issue.message,
    }));
    return {
        statusCode: 400,
        message: "Validation error",
        errorMessages,
    };
};
exports.default = handleZodError;
