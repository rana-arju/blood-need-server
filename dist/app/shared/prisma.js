"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const logger_1 = require("./logger");
// Create a singleton Prisma client
class PrismaManager {
    static instance;
    constructor() { }
    static getInstance() {
        if (!PrismaManager.instance) {
            PrismaManager.instance = new client_1.PrismaClient({
                log: ["query", "warn", "info"], // ✅ Use Prisma's built-in logging
            });
            // Middleware to log slow queries
            PrismaManager.instance.$use(async (params, next) => {
                const before = Date.now();
                const result = await next(params);
                const after = Date.now();
                if (after - before > 500) {
                    logger_1.logger.warn(`Slow query detected (${after - before}ms): ${params.model}.${params.action}`);
                }
                return result;
            });
            // Handle graceful shutdown
            PrismaManager.instance.$on("beforeExit", async () => {
                await PrismaManager.instance.$disconnect();
                logger_1.logger.info("Prisma is disconnecting...");
            });
            // Connect to the database
            PrismaManager.instance
                .$connect()
                .then(() => {
                logger_1.logger.info("Successfully connected to database");
            })
                .catch((error) => {
                logger_1.errorLogger.error("Failed to connect to database", { error });
            });
        }
        return PrismaManager.instance;
    }
    // Method to disconnect (useful for tests and graceful shutdown)
    static async disconnect() {
        if (PrismaManager.instance) {
            await PrismaManager.instance.$disconnect();
            logger_1.logger.info("Disconnected from database");
        }
    }
}
// Export the singleton instance
const prisma = PrismaManager.getInstance();
exports.default = prisma;
