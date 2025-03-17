import { PrismaClient } from "@prisma/client";
import type { IStatistics } from "./statistics.interface";
import cache from "../../shared/cache";

const prisma = new PrismaClient();

const getStatistics = async (): Promise<IStatistics> => {
  // Use cache with 5 minute TTL for statistics
  return await cache.getCachedData<IStatistics>(
    "global_statistics",
    300, // 5 minutes TTL
    async () => {
      // Use Promise.all to run all database queries concurrently
      const [totalUsers, totalDonors, totalBloodRequests, totalEvents] =
        await Promise.all([
          prisma.user.count(),
          prisma.bloodDonor.count(),
          prisma.bloodRequest.count(),
          prisma.bloodDrive.count(),
        ]);

      return {
        users: totalUsers,
        donors: totalDonors,
        requests: totalBloodRequests,
        events: totalEvents,
      };
    }
  );
};
export const StatisticsService = {
  getStatistics,
};
