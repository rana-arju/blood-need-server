"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderatorMiddleware = exports.userMiddleware = exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
// Initialize Prisma Client
const prisma = new client_1.PrismaClient();
// Middleware to authenticate the user
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get the token from the Authorization header
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        // If token is missing, return an error
        if (!token) {
            throw new Error("No token provided");
        }
        // Decode and verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Find the user in the database based on the decoded id
        const user = yield prisma.user.findUnique({
            where: { id: decoded.id },
        });
        // If no user is found, return an authentication error
        if (!user) {
            throw new Error("User not found");
        }
        // Attach user information to the request object
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        // If authentication fails, return an error response
        res.status(401).json({ error: "Please authenticate" });
    }
});
exports.authMiddleware = authMiddleware;
// Middleware for role-based access control (RBAC) - Admin only
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
        next(); // User is admin, proceed
    }
    else {
        res.status(403).json({ error: "Access denied. Admin only." });
    }
};
exports.adminMiddleware = adminMiddleware;
// Middleware for role-based access control (RBAC) - User only
const userMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "USER") {
        next(); // User has the "USER" role, proceed
    }
    else {
        res.status(403).json({ error: "Access denied. User only." });
    }
};
exports.userMiddleware = userMiddleware;
// Middleware for role-based access control (RBAC) - Moderator only
const moderatorMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "MODERATOR") {
        next(); // User has the "MODERATOR" role, proceed
    }
    else {
        res.status(403).json({ error: "Access denied. Moderator only." });
    }
};
exports.moderatorMiddleware = moderatorMiddleware;
