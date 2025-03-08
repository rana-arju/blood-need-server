import { PrismaClient } from "@prisma/client";
import type { IStatistics } from "./statistics.interface";

const prisma = new PrismaClient();

const getStatistics = async (): Promise<IStatistics> => {
  // Use Promise.all to run all database queries concurrently
  const [users, donors, requests, events] = await Promise.all([
    prisma.user.count(),
    prisma.bloodDonor.count(),
    prisma.bloodRequest.count(),
    prisma.bloodDrive.count(),
  ]);

  return {
    users,
    donors,
    requests,
    events,
  };
};

export const StatisticsService = {
  getStatistics,
};
