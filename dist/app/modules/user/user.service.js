"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const paginationHelper_1 = require("../../helpers/paginationHelper");
const AppError_1 = __importDefault(require("../../error/AppError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bson_1 = require("bson");
const achievement_service_1 = require("../achievement/achievement.service");
const randomPass = Math.random().toString(36).slice(2, 12);
const getAllUsers = async (filters, paginationOptions) => {
    const { searchTerm, blood } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: ["name", "email"].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (blood) {
        andConditions.push({
            blood: {
                equals: blood,
            },
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = await prisma_1.default.user.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const createUser = async (payload) => {
    const password = payload?.password || randomPass;
    const userExist = await prisma_1.default.user.findUnique({
        where: {
            email: payload?.email,
        },
    });
    if (userExist) {
        if ((userExist?.provider && userExist?.provider == "google") ||
            userExist?.provider == "facebook") {
            return userExist;
        }
        throw new AppError_1.default(401, "User already exist!");
    }
    // 🔹 Hash the password before storing it
    const hashedPassword = await bcrypt_1.default.hash(password, 10); // 10 = salt rounds
    payload.password = hashedPassword;
    const result = await prisma_1.default.$transaction(async (tx) => {
        // Create the user
        const newUser = await tx.user.create({
            data: payload,
        });
        // Initialize achievements for the new user
        await achievement_service_1.AchievementService.initializeUserAchievements(newUser.id);
        return newUser;
    });
    return result;
};
const loginUser = async (payload) => {
    const password = payload?.password;
    const userExist = await prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!userExist) {
        throw new AppError_1.default(401, "User does not exist!");
    }
    // 🔹 Compare the password
    const isMatch = await bcrypt_1.default.compare(password, userExist.password);
    if (!isMatch)
        throw new AppError_1.default(401, "Invalid email or password");
    return userExist;
};
const updateUser = async (id, payload) => {
    const userExist = await prisma_1.default.user.findUnique({
        where: { id },
    });
    if (!userExist) {
        throw new AppError_1.default(404, "This user not found!");
    }
    const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== undefined));
    const result = await prisma_1.default.user.update({
        where: { id },
        data: { ...cleanPayload, profileUpdate: true },
    });
    return result;
};
const deleteUser = async (id) => {
    const result = await prisma_1.default.user.delete({
        where: {
            id,
        },
    });
    return result;
};
const getMeUser = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
const getUser = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        include: {
            donorInfo: {
                select: {
                    phone: true,
                    whatsappNumber: true,
                    facebookId: true,
                    emergencyContact: true,
                    height: true,
                    weight: true,
                    medicalCondition: true,
                    currentMedications: true,
                },
            },
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
const updateDonationCount = async (userId) => {
    if (!bson_1.ObjectId.isValid(userId)) {
        throw new AppError_1.default(400, "Invalid user ID format");
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    // Count completed donations
    const completedDonationsCount = await prisma_1.default.donation.count({
        where: {
            userId,
            status: "completed",
        },
    });
    // Update user's donation count
    await prisma_1.default.user.update({
        where: { id: userId },
        data: {
            donationCount: completedDonationsCount,
            lastDonationDate: new Date(),
        },
    });
    // Check and update achievements
    await achievement_service_1.AchievementService.checkAndUpdateAchievements(userId);
};
exports.UserService = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    getMeUser,
    getUser,
    updateDonationCount,
};
