"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsService = void 0;
const client_1 = require("@prisma/client");
const cache_1 = __importDefault(require("../../shared/cache"));
const prisma = new client_1.PrismaClient();
const getStatistics = async () => {
    // Use cache with 5 minute TTL for statistics
    return await cache_1.default.getCachedData("global_statistics", 300, // 5 minutes TTL
    async () => {
        // Use Promise.all to run all database queries concurrently
        const [totalUsers, totalDonors, totalBloodRequests, totalEvents] = await Promise.all([
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
    });
};
exports.StatisticsService = {
    getStatistics,
};
