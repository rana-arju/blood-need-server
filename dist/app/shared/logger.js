"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityLogger = exports.errorLogger = exports.logger = void 0;
const path_1 = __importDefault(require("path"));
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// Define log colors
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
};
// Add colors to winston
winston_1.default.addColors(colors);
// Define log format
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }), winston_1.default.format.metadata({
    fillExcept: ["message", "level", "timestamp", "label"],
}), winston_1.default.format.json());
// Define transport for success logs
const successTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(process.cwd(), "logs", "winston", "successes", "success-%DATE%.log"),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "info",
});
// Define transport for error logs
const errorTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(process.cwd(), "logs", "winston", "errors", "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
    level: "error",
});
// Define transport for security logs
const securityTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(process.cwd(), "logs", "winston", "security", "security-%DATE%.log"),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "90d",
    level: "warn",
});
// Define console transport for development
const consoleTransport = new winston_1.default.transports.Console({
    format: winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)),
});
// Create logger instance
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
    levels,
    format,
    transports: [
        successTransport,
        errorTransport,
        securityTransport,
        ...(process.env.NODE_ENV !== "production" ? [consoleTransport] : []),
    ],
});
exports.logger = logger;
// Create security logger for security-related events
const securityLogger = winston_1.default.createLogger({
    level: "warn",
    levels,
    format,
    transports: [
        securityTransport,
        ...(process.env.NODE_ENV !== "production" ? [consoleTransport] : []),
    ],
});
exports.securityLogger = securityLogger;
// Create error logger
const errorLogger = winston_1.default.createLogger({
    level: "error",
    levels,
    format,
    transports: [
        errorTransport,
        ...(process.env.NODE_ENV !== "production" ? [consoleTransport] : []),
    ],
});
exports.errorLogger = errorLogger;
