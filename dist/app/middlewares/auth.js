"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../shared/prisma")); // Prisma instance for MongoDB
const AppError_1 = __importDefault(require("../error/AppError"));
// Auth middleware for checking userId and user roles
const auth = (...requiredRoles) => {
    return async (req, res, next) => {
        const userId = req.headers.authorization?.split(" ")[1]; // Get userId from "Bearer <userId>"
        if (!userId) {
            return next(new AppError_1.default(401, "You are unauthorized to access"));
        }
        // Fetch user from MongoDB using Prisma based on the userId passed in the token
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return next(new AppError_1.default(404, "User not found"));
        }
        // Check if the user is blocked
        if (user.status === "blocked") {
            return next(new AppError_1.default(403, "User is blocked"));
        }
        // Check for role-based access control
        if (requiredRoles.length &&
            !requiredRoles.includes(user.role)) {
            return next(new AppError_1.default(403, "You are not authorized to access this resource"));
        }
        req.user = { id: user.id, role: user?.role, email: user?.email }; // Set user in the request object
        next();
    };
};
exports.default = auth;
