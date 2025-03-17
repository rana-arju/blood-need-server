"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    jwt: {
        secret: process.env.JWT_SECRET,
        expires_in: process.env.JWT_EXPIRES_IN,
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: Number.parseInt(process.env.EMAIL_PORT || "587", 10),
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        from: process.env.EMAIL_FROM,
    },
    vapid: {
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY,
    },
    security: {
        bcrypt_salt_rounds: Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),
        rate_limit: {
            window_ms: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
            max_requests: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
        },
        cors: {
            origin: process.env.CORS_ORIGIN || "*",
            methods: process.env.CORS_METHODS || "GET,HEAD,PUT,PATCH,POST,DELETE",
        },
    },
};
