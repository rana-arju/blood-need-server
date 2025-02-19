import app from "./app";
import { PrismaClient } from "@prisma/client";
import logger from "./app/shared/logger";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");

    if (process.env.VERCEL) {
      // For Vercel serverless deployment
      module.exports = app;
    } else {
      // For local development
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
      });
    }
  } catch (error) {
    logger.error("Error during server initialization:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error("Unhandled error:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});
