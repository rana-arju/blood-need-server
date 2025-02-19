import app from "./app";
import { PrismaClient } from "@prisma/client";
import logger from "./app/shared/logger";

const prisma = new PrismaClient();
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
      app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
      });
    }
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
}

main();
