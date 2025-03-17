import { PrismaClient } from "@prisma/client";
import { logger, errorLogger } from "./logger";

// Create a singleton Prisma client
class PrismaManager {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaManager.instance) {
      PrismaManager.instance = new PrismaClient({
        log: ["query", "warn", "info"], // ✅ Use Prisma's built-in logging
      });

      // Middleware to log slow queries
      PrismaManager.instance.$use(async (params, next) => {
        const before = Date.now();
        const result = await next(params);
        const after = Date.now();

        if (after - before > 500) {
          logger.warn(
            `Slow query detected (${after - before}ms): ${params.model}.${
              params.action
            }`
          );
        }

        return result;
      });

      // Handle graceful shutdown
      PrismaManager.instance.$on("beforeExit", async () => {
        await PrismaManager.instance.$disconnect();
        logger.info("Prisma is disconnecting...");
      });

      // Connect to the database
      PrismaManager.instance
        .$connect()
        .then(() => {
          logger.info("Successfully connected to database");
        })
        .catch((error) => {
          errorLogger.error("Failed to connect to database", { error });
        });
    }

    return PrismaManager.instance;
  }

  // Method to disconnect (useful for tests and graceful shutdown)
  public static async disconnect(): Promise<void> {
    if (PrismaManager.instance) {
      await PrismaManager.instance.$disconnect();
      logger.info("Disconnected from database");
    }
  }
}

// Export the singleton instance
const prisma = PrismaManager.getInstance();
export default prisma;
