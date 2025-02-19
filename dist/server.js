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
const port = process.env.PORT || 3000;
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
                const server = app_1.default.listen(port, () => {
                    logger_1.default.info(`Server is running on port ${port}`);
                });
                const exitHandler = () => {
                    if (server) {
                        server.close(() => {
                            logger_1.default.info("Server closed");
                        });
                    }
                    process.exit(1);
                };
                const unexpectedErrorHandler = (error) => {
                    logger_1.default.error(error);
                    exitHandler();
                };
                process.on("uncaughtException", unexpectedErrorHandler);
                process.on("unhandledRejection", unexpectedErrorHandler);
                process.on("SIGTERM", () => {
                    logger_1.default.info("SIGTERM received");
                    if (server) {
                        server.close();
                    }
                });
            }
        }
        catch (err) {
            logger_1.default.error("Unable to connect to the database:", err);
        }
    });
}
main();
