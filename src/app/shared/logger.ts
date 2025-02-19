import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Custom log format for better readability
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    ({ timestamp, level, message }) =>
      `[${timestamp}] ${level.toUpperCase()}: ${message}`
  )
);

// Console format with colors (for development)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.simple(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
  )
);

// Success logger
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new DailyRotateFile({
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
    }),
  ],
});

// Error logger
const errorLogger = winston.createLogger({
  level: "error",
  format: logFormat,
  transports: [
    new DailyRotateFile({
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
      maxFiles: "14d",
    }),
  ],
});

// Add console transport if not in production
if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({ format: consoleFormat }));
  errorLogger.add(new winston.transports.Console({ format: consoleFormat }));
}

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new winston.transports.File({
    filename: path.join(process.cwd(), "logs", "winston", "exceptions.log"),
  })
);

process.on("unhandledRejection", (reason: unknown) => {
  errorLogger.error(`Unhandled Rejection: ${JSON.stringify(reason)}`);
});

export { logger, errorLogger };
