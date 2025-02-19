import type { Server } from "http";
import app from "./app";
import config from "./app/config";
import { PrismaClient } from "@prisma/client";
import { logger } from "./app/shared/logger";
import prisma from "./app/shared/prisma";
const port = process.env.PORT || 3000;
async function main() {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");

    if (process.env.VERCEL) {
      // For Vercel serverless deployment
      module.exports = app;
    } else {
      // For local development
      const server: Server = app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
      });

      const exitHandler = () => {
        if (server) {
          server.close(() => {
            logger.info("Server closed");
          });
        }
        process.exit(1);
      };

      const unexpectedErrorHandler = (error: unknown) => {
        logger.error(error);
        exitHandler();
      };

      process.on("uncaughtException", unexpectedErrorHandler);
      process.on("unhandledRejection", unexpectedErrorHandler);

      process.on("SIGTERM", () => {
        logger.info("SIGTERM received");
        if (server) {
          server.close();
        }
      });
    }
  } catch (err) {
    logger.error("Unable to connect to the database:", err);
  }
}

main();
