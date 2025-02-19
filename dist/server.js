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
const app_1 = __importDefault(require("./app"));
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("./app/shared/logger"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.$connect();
            logger_1.default.info("Database connected successfully");
            if (process.env.VERCEL) {
                // For Vercel serverless deployment
                module.exports = app_1.default;
            }
            else {
                // For local development
                const port = process.env.PORT || 3000;
                app_1.default.listen(port, () => {
                    logger_1.default.info(`Server is running on port ${port}`);
                });
            }
        }
        catch (error) {
            logger_1.default.error("Error during server initialization:", error);
            process.exit(1);
        }
    });
}
main().catch((error) => {
    logger_1.default.error("Unhandled error:", error);
    process.exit(1);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    logger_1.default.error("Unhandled Rejection at:", promise, "reason:", reason);
    // Application specific logging, throwing an error, or other logic here
});
