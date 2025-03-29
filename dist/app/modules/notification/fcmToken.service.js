"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FCMTokenService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const bson_1 = require("bson");
// Register or update FCM token
const registerToken = async (userId, token, device) => {
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
    // Check if token already exists
    const existingToken = await prisma_1.default.fCMToken.findUnique({
        where: { token },
    });
    if (existingToken) {
        // If token exists but for a different user, update it
        if (existingToken.userId !== userId) {
            return await prisma_1.default.fCMToken.update({
                where: { token },
                data: {
                    userId,
                    device,
                    updatedAt: new Date(),
                },
            });
        }
        // If token exists for the same user, just update the timestamp
        return await prisma_1.default.fCMToken.update({
            where: { token },
            data: {
                device,
                updatedAt: new Date(),
            },
        });
    }
    // Create new token
    return await prisma_1.default.fCMToken.create({
        data: {
            userId,
            token,
            device,
        },
    });
};
// Remove FCM token
const removeToken = async (token) => {
    const existingToken = await prisma_1.default.fCMToken.findUnique({
        where: { token },
    });
    if (!existingToken) {
        throw new AppError_1.default(404, "Token not found");
    }
    return await prisma_1.default.fCMToken.delete({
        where: { token },
    });
};
// Get all tokens for a user
const getUserTokens = async (userId) => {
    if (!bson_1.ObjectId.isValid(userId)) {
        throw new AppError_1.default(400, "Invalid user ID format");
    }
    return await prisma_1.default.fCMToken.findMany({
        where: { userId },
    });
};
// Get all tokens for users in a district
const getDistrictTokens = async (district) => {
    // Find all users in the district
    const users = await prisma_1.default.user.findMany({
        where: { district },
        select: { id: true },
    });
    const userIds = users.map((user) => user.id);
    // Find all tokens for these users
    const tokens = await prisma_1.default.fCMToken.findMany({
        where: {
            userId: {
                in: userIds,
            },
        },
    });
    return tokens;
};
exports.FCMTokenService = {
    registerToken,
    removeToken,
    getUserTokens,
    getDistrictTokens,
};
