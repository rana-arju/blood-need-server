import DataLoader from "dataloader";
import prisma from "./prisma";

// Create a factory for dataloaders
export function createLoaders() {
  // User loader
  const userLoader = new DataLoader(async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: [...ids],
        },
      },
    });

    // Map users to the order of ids
    const userMap: Record<string, any> = {};
    users.forEach((user) => {
      userMap[user.id] = user;
    });

    return ids.map((id) => userMap[id] || null);
  });

  // Blood donor loader
  const bloodDonorLoader = new DataLoader(
    async (userIds: readonly string[]) => {
      const donors = await prisma.bloodDonor.findMany({
        where: {
          userId: {
            in: [...userIds],
          },
        },
      });

      // Map donors to the order of userIds
      const donorMap: Record<string, any> = {};
      donors.forEach((donor) => {
        donorMap[donor.userId] = donor;
      });

      return userIds.map((userId) => donorMap[userId] || null);
    }
  );

  // Blood request loader
  const bloodRequestLoader = new DataLoader(async (ids: readonly string[]) => {
    const requests = await prisma.bloodRequest.findMany({
      where: {
        id: {
          in: [...ids],
        },
      },
    });

    // Map requests to the order of ids
    const requestMap: Record<string, any> = {};
    requests.forEach((request) => {
      requestMap[request.id] = request;
    });

    return ids.map((id) => requestMap[id] || null);
  });

  // Return all loaders
  return {
    userLoader,
    bloodDonorLoader,
    bloodRequestLoader,
  };
}
