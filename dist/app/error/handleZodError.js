"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    const errorMessages = error.issues.map((issuse) => {
        return {
            path: issuse?.path[issuse.path.length - 1],
            message: issuse?.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: "validation error",
        errorMessages,
    };
};
exports.default = handleZodError;
