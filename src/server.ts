import app from "./app";
import { PrismaClient } from "@prisma/client";
import logger from "./app/shared/logger";

const prisma = new PrismaClient();

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");

    const port = process.env.PORT || 3000;

    if (!process.env.VERCEL) {
      app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
      });
    }
  } catch (error) {
    logger.error("Error during server initialization:", error);
    process.exit(1);
  }
}

// Start the server in non-Vercel environments
if (!process.env.VERCEL) {
  bootstrap().catch((error) => {
    logger.error("Unhandled error:", error);
    process.exit(1);
  });
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Export the Express app for Vercel
export default app;
