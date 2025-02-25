"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("./app/shared/logger"));
const prisma = new client_1.PrismaClient();
async function bootstrap() {
    try {
        await prisma.$connect();
        logger_1.default.info("Database connected successfully");
        const port = process.env.PORT || 3000;
        if (!process.env.VERCEL) {
            app_1.default.listen(port, () => {
                logger_1.default.info(`Server is running on port ${port}`);
            });
        }
    }
    catch (error) {
        logger_1.default.error("Error during server initialization:", error);
        process.exit(1);
    }
}
// Start the server in non-Vercel environments
if (!process.env.VERCEL) {
    bootstrap().catch((error) => {
        logger_1.default.error("Unhandled error:", error);
        process.exit(1);
    });
}
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    logger_1.default.error("Unhandled Rejection at:", promise, "reason:", reason);
});
// Export the Express app for Vercel
exports.default = app_1.default;
