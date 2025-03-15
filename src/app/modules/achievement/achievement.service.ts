import prisma from "../../shared/prisma";
import AppError from "../../error/AppError";
import { ObjectId } from "bson";
import * as notificationService from "../notification/notification.service";

// Define achievement types and requirements
const ACHIEVEMENTS = [
  {
    name: "First Time Donor",
    description: "Donated blood for the first time",
    requiredDonations: 1,
    badgeImage: "/badges/first-time-donor.png",
  },
  {
    name: "Regular Donor",
    description: "Donated blood 3 times",
    requiredDonations: 3,
    badgeImage: "/badges/regular-donor.png",
  },
  {
    name: "Silver Donor",
    description: "Donated blood 5 times",
    requiredDonations: 5,
    badgeImage: "/badges/silver-donor.png",
  },
  {
    name: "Gold Donor",
    description: "Donated blood 10 times",
    requiredDonations: 10,
    badgeImage: "/badges/gold-donor.png",
  },
  {
    name: "Platinum Donor",
    description: "Donated blood 25 times",
    requiredDonations: 25,
    badgeImage: "/badges/platinum-donor.png",
  },
  {
    name: "Diamond Donor",
    description: "Donated blood 50 times",
    requiredDonations: 50,
    badgeImage: "/badges/diamond-donor.png",
  },
  {
    name: "Lifesaver",
    description: "Donated blood 100 times",
    requiredDonations: 100,
    badgeImage: "/badges/lifesaver.png",
  },
];

async function getUserAchievements(userId: string) {
  if (!ObjectId.isValid(userId)) {
    throw new AppError(400, "Invalid user ID format");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user.achievements;
}

async function checkAndUpdateAchievements(userId: string) {
  if (!ObjectId.isValid(userId)) {
    throw new AppError(400, "Invalid user ID format");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const donationCount = user.donationCount;
  const existingAchievements = user.achievements;

  // Initialize achievements for new users
  if (existingAchievements.length === 0) {
    await initializeUserAchievements(userId);
    return await getUserAchievements(userId);
  }

  // Update achievements based on donation count
  const updatedAchievements = [];

  for (const achievement of existingAchievements) {
    const achievementConfig = ACHIEVEMENTS.find(
      (a) => a.name === achievement.name
    );

    if (!achievementConfig) continue;

    const requiredDonations = achievementConfig.requiredDonations;
    const progress = Math.min(
      100,
      Math.floor((donationCount / requiredDonations) * 100)
    );
    const achieved = donationCount >= requiredDonations;

    // Only update if there's a change
    if (
      achievement.progress !== progress ||
      achievement.achieved !== achieved
    ) {
      const updatedAchievement = await prisma.achievement.update({
        where: { id: achievement.id },
        data: {
          progress,
          achieved,
          achievedDate:
            achieved && !achievement.achieved
              ? new Date()
              : achievement.achievedDate,
        },
      });

      // If newly achieved, send notification
      
      if (achieved && !achievement.achieved) {
        /*
        await notificationService.createNotification({
          userId,
          title: "New Achievement Unlocked!",
          body: `Congratulations! You've earned the "${achievement.name}" badge.`,
          url: `/profile/achievements`,
        });
*/
        // Update user's reward badge if this is the highest achieved
        const highestAchievedIndex = ACHIEVEMENTS.findIndex(
          (a) => a.name === achievement.name
        );
        const currentBadgeIndex = ACHIEVEMENTS.findIndex(
          (a) => a.name === user.rewardBadge
        );

        if (highestAchievedIndex > currentBadgeIndex || !user.rewardBadge) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              rewardBadge: achievement.name,
            },
          });
        }
      }

      updatedAchievements.push(updatedAchievement);
    }
  }

  return updatedAchievements.length > 0
    ? updatedAchievements
    : existingAchievements;
}

async function initializeUserAchievements(userId: string) {
  if (!ObjectId.isValid(userId)) {
    throw new AppError(400, "Invalid user ID format");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const donationCount = user.donationCount;
  const achievements = [];

  // Create all achievement records for the user
  for (const achievement of ACHIEVEMENTS) {
    const progress = Math.min(
      100,
      Math.floor((donationCount / achievement.requiredDonations) * 100)
    );
    const achieved = donationCount >= achievement.requiredDonations;

    const newAchievement = await prisma.achievement.create({
      data: {
        userId,
        name: achievement.name,
        description: achievement.description,
        progress,
        achieved,
        achievedDate: achieved ? new Date() : null,
        badgeImage: achievement.badgeImage,
      },
    });

    achievements.push(newAchievement);
  }

  // Set the highest achieved badge as the user's reward badge
  const highestAchieved = achievements
    .filter((a) => a.achieved)
    .sort((a, b) => {
      const aIndex = ACHIEVEMENTS.findIndex((ach) => ach.name === a.name);
      const bIndex = ACHIEVEMENTS.findIndex((ach) => ach.name === b.name);
      return bIndex - aIndex; // Sort in descending order
    })[0];

  if (highestAchieved) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        rewardBadge: highestAchieved.name,
      },
    });
  }

  return achievements;
}

export const AchievementService = {
  getUserAchievements,
  checkAndUpdateAchievements,
  initializeUserAchievements,
};
