"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./app/shared/logger");
const prisma_1 = __importDefault(require("./app/shared/prisma")); // Use the singleton prisma instance
// Check if we're running on Vercel
const isVercel = process.env.VERCEL_REGION || process.env.VERCEL_URL;
async function bootstrap() {
    try {
        // The singleton pattern in prisma.ts handles the connection
        logger_1.logger.info("Database connection initialized");
        // Only start the server if not running on Vercel
        if (!isVercel) {
            const port = process.env.PORT || 3000;
            app_1.default.listen(port, () => {
                logger_1.logger.info(`Server is running on port ${port}`);
            });
        }
        else {
            logger_1.logger.info("Running on Vercel - serverless mode");
        }
    }
    catch (error) {
        logger_1.logger.error("Error during server initialization:", {
            error: error instanceof Error ? error.message : String(error),
        });
        // Don't exit the process on Vercel
        if (!isVercel) {
            process.exit(1);
        }
    }
}
// Start the server in non-Vercel environments
if (!isVercel) {
    bootstrap().catch((error) => {
        logger_1.logger.error("Unhandled error:", {
            error: error instanceof Error ? error.message : String(error),
        });
        process.exit(1);
    });
}
else {
    // For Vercel, just initialize the database connection
    bootstrap().catch((error) => {
        logger_1.logger.error("Unhandled error on Vercel:", {
            error: error instanceof Error ? error.message : String(error),
        });
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
    // Don't exit the process on Vercel
    if (!isVercel) {
        process.exit(1);
    }
});
// Graceful shutdown
process.on("SIGTERM", async () => {
    logger_1.logger.info("SIGTERM received, shutting down gracefully");
    // Close database connections and other resources
    await prisma_1.default.$disconnect();
    // Don't exit the process on Vercel
    if (!isVercel) {
        process.exit(0);
    }
});
// Export the Express app for Vercel
exports.default = app_1.default;
