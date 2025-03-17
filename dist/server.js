"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./app/shared/logger");
const prisma_1 = __importDefault(require("./app/shared/prisma")); // Use the singleton prisma instance
async function bootstrap() {
    try {
        // No need to create a new PrismaClient instance here
        // The singleton pattern in prisma.ts handles the connection
        logger_1.logger.info("Database connection initialized");
        const port = process.env.PORT || 3000;
        if (!process.env.VERCEL) {
            app_1.default.listen(port, () => {
                logger_1.logger.info(`Server is running on port ${port}`);
            });
        }
    }
    catch (error) {
        logger_1.logger.error("Error during server initialization:", {
            error: error instanceof Error ? error.message : String(error),
        });
        process.exit(1);
    }
}
// Start the server in non-Vercel environments
if (!process.env.VERCEL) {
    bootstrap().catch((error) => {
        logger_1.logger.error("Unhandled error:", {
            error: error instanceof Error ? error.message : String(error),
        });
        process.exit(1);
    });
}
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    logger_1.logger.error("Unhandled Rejection at:", {
        promise: String(promise),
        reason: reason instanceof Error ? reason.message : String(reason),
    });
});
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    logger_1.logger.error("Uncaught Exception:", {
        error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
});
// Graceful shutdown
process.on("SIGTERM", async () => {
    logger_1.logger.info("SIGTERM received, shutting down gracefully");
    // Close database connections and other resources
    await prisma_1.default.$disconnect();
    process.exit(0);
});
// Export the Express app for Vercel
exports.default = app_1.default;
