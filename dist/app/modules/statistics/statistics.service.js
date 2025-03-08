"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getStatistics = async () => {
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
exports.StatisticsService = {
    getStatistics,
};
