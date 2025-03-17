import app from "./app";
import { logger } from "./app/shared/logger";
import prisma from "./app/shared/prisma"; // Use the singleton prisma instance

// Check if we're running on Vercel
const isVercel = process.env.VERCEL_REGION || process.env.VERCEL_URL;

async function bootstrap() {
  try {
    // The singleton pattern in prisma.ts handles the connection
    logger.info("Database connection initialized");

    // Only start the server if not running on Vercel
    if (!isVercel) {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
      });
    } else {
      logger.info("Running on Vercel - serverless mode");
    }
  } catch (error) {
    logger.error("Error during server initialization:", {
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
    logger.error("Unhandled error:", {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  });
} else {
  // For Vercel, just initialize the database connection
  bootstrap().catch((error) => {
    logger.error("Unhandled error on Vercel:", {
      error: error instanceof Error ? error.message : String(error),
    });
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

  // Don't exit the process on Vercel
  if (!isVercel) {
    process.exit(1);
  }
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  // Close database connections and other resources
  await prisma.$disconnect();

  // Don't exit the process on Vercel
  if (!isVercel) {
    process.exit(0);
  }
});

// Export the Express app for Vercel
export default app;
