import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

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
winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.metadata({
    fillExcept: ["message", "level", "timestamp", "label"],
  }),
  winston.format.json()
);

// Define transport for success logs
const successTransport = new DailyRotateFile({
  filename: path.join(
    process.cwd(),
    "logs",
    "winston",
    "successes",
    "success-%DATE%.log"
  ),
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "info",
});

// Define transport for error logs
const errorTransport = new DailyRotateFile({
  filename: path.join(
    process.cwd(),
    "logs",
    "winston",
    "errors",
    "error-%DATE%.log"
  ),
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
  level: "error",
});

// Define transport for security logs
const securityTransport = new DailyRotateFile({
  filename: path.join(
    process.cwd(),
    "logs",
    "winston",
    "security",
    "security-%DATE%.log"
  ),
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "90d",
  level: "warn",
});

// Define console transport for development
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
});

// Create logger instance
const logger = winston.createLogger({
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

// Create security logger for security-related events
const securityLogger = winston.createLogger({
  level: "warn",
  levels,
  format,
  transports: [
    securityTransport,
    ...(process.env.NODE_ENV !== "production" ? [consoleTransport] : []),
  ],
});

// Create error logger
const errorLogger = winston.createLogger({
  level: "error",
  levels,
  format,
  transports: [
    errorTransport,
    ...(process.env.NODE_ENV !== "production" ? [consoleTransport] : []),
  ],
});

export { logger, errorLogger, securityLogger };
