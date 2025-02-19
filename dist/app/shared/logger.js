"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Remove any imports related to file-based logging
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    defaultMeta: { service: "blood-donation-api" },
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.printf(({ timestamp, level, message }) => {
                return `${timestamp} ${level}: ${message}`;
            })),
        }),
    ],
});
exports.default = logger;
