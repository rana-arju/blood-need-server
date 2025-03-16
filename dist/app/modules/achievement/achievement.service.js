"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const bson_1 = require("bson");
// Define achievement types and requirements
const ACHIEVEMENTS = [
    {
        name: "First Time Donor",
        description: "Donated blood for the first time",
        requiredDonations: 1,
        badgeImage: "https://res.cloudinary.com/db8l1ulfq/image/upload/v1742123398/award_1_rpylxe.png",
    },
    {
        name: "Regular Donor",
        description: "Donated blood 3 times",
        requiredDonations: 3,
        badgeImage: "https://res.cloudinary.com/db8l1ulfq/image/upload/v1742123399/medal_2_a1b3ed.png",
    },
    {
        name: "Silver Donor",
        description: "Donated blood 5 times",
        requiredDonations: 5,
        badgeImage: "https://res.cloudinary.com/db8l1ulfq/image/upload/v1742123661/achivement_1_iz2jkn.png",
    },
    {
        name: "Gold Donor",
        description: "Donated blood 10 times",
        requiredDonations: 10,
        badgeImage: "https://res.cloudinary.com/db8l1ulfq/image/upload/v1742123399/achievement_1_cimamx.png",
    },
    {
        name: "Platinum Donor",
        description: "Donated blood 25 times",
        requiredDonations: 25,
        badgeImage: "https://res.cloudinary.com/db8l1ulfq/image/upload/v1742124021/trophy_1_mr4hyw.png",
    },
    {
        name: "Diamond Donor",
        description: "Donated blood 50 times",
        requiredDonations: 50,
        badgeImage: "https://res.cloudinary.com/db8l1ulfq/image/upload/v1742123399/medal_1_lkgtmx.png",
    },
    {
        name: "Lifesaver",
        description: "Donated blood 100 times",
        requiredDonations: 100,
        badgeImage: "https://res.cloudinary.com/db8l1ulfq/image/upload/v1742123943/target_2_1_ltmyv5.png",
    },
];
async function getUserAchievements(userId) {
    if (!bson_1.ObjectId.isValid(userId)) {
        throw new AppError_1.default(400, "Invalid user ID format");
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        include: {
            achievements: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    return user.achievements;
}
async function checkAndUpdateAchievements(userId) {
    if (!bson_1.ObjectId.isValid(userId)) {
        throw new AppError_1.default(400, "Invalid user ID format");
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        include: {
            achievements: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
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
        const achievementConfig = ACHIEVEMENTS.find((a) => a.name === achievement.name);
        if (!achievementConfig)
            continue;
        const requiredDonations = achievementConfig.requiredDonations;
        const progress = Math.min(100, Math.floor((donationCount / requiredDonations) * 100));
        const achieved = donationCount >= requiredDonations;
        // Only update if there's a change
        if (achievement.progress !== progress ||
            achievement.achieved !== achieved) {
            const updatedAchievement = await prisma_1.default.achievement.update({
                where: { id: achievement.id },
                data: {
                    progress,
                    achieved,
                    achievedDate: achieved && !achievement.achieved
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
                const highestAchievedIndex = ACHIEVEMENTS.findIndex((a) => a.name === achievement.name);
                const currentBadgeIndex = ACHIEVEMENTS.findIndex((a) => a.name === user.rewardBadge);
                if (highestAchievedIndex > currentBadgeIndex || !user.rewardBadge) {
                    await prisma_1.default.user.update({
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
async function initializeUserAchievements(userId) {
    if (!bson_1.ObjectId.isValid(userId)) {
        throw new AppError_1.default(400, "Invalid user ID format");
    }
    // Check if user exists
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    // Check if user already has achievements
    const existingAchievements = await prisma_1.default.achievement.findMany({
        where: { userId },
    });
    // If user already has achievements, don't initialize again
    if (existingAchievements.length > 0) {
        return existingAchievements;
    }
    const donationCount = user.donationCount;
    const achievements = [];
    // Create all achievement records for the user
    for (const achievement of ACHIEVEMENTS) {
        const progress = Math.min(100, Math.floor((donationCount / achievement.requiredDonations) * 100));
        const achieved = donationCount >= achievement.requiredDonations;
        const newAchievement = await prisma_1.default.achievement.create({
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
        await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                rewardBadge: highestAchieved.name,
            },
        });
    }
    return achievements;
}
exports.AchievementService = {
    getUserAchievements,
    checkAndUpdateAchievements,
    initializeUserAchievements,
};
