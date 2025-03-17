import app from "./app";
import { logger } from "./app/shared/logger";
import prisma from "./app/shared/prisma"; // Use the singleton prisma instance

async function bootstrap() {
  try {
    // No need to create a new PrismaClient instance here
    // The singleton pattern in prisma.ts handles the connection

    logger.info("Database connection initialized");

    const port = process.env.PORT || 3000;

    if (!process.env.VERCEL) {
      app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
      });
    }
  } catch (error) {
    logger.error("Error during server initialization:", {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

// Start the server in non-Vercel environments
if (!process.env.VERCEL) {
  bootstrap().catch((error) => {
    logger.error("Unhandled error:", {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  });
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", {
    promise: String(promise),
    reason: reason instanceof Error ? reason.message : String(reason),
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  // Close database connections and other resources
  await prisma.$disconnect();
  process.exit(0);
});

// Export the Express app for Vercel
export default app;
