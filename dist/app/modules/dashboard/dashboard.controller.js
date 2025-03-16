"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDashboard = void 0;
const date_fns_1 = require("date-fns");
const prisma_1 = __importDefault(require("../../shared/prisma"));
// Get dashboard data for a user
const getUserDashboard = async (req, res) => {
    try {
        const { userId } = req.params;
        // Get user with donor info
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                donorInfo: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Get donations
        const donations = await prisma_1.default.donation.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        // Get health records
        const healthRecords = await prisma_1.default.healthRecord.findMany({
            where: { userId },
            orderBy: { date: "desc" },
            take: 6,
        });
        // Get blood requests
        const bloodRequests = await prisma_1.default.bloodRequest.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        // Get achievements
        const achievements = await prisma_1.default.achievement.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        // Calculate next eligible date (3 months after last donation)
        let nextEligibleDate = null;
        if (user.lastDonationDate) {
            const eligibleDate = (0, date_fns_1.addMonths)(new Date(user.lastDonationDate), 3);
            if ((0, date_fns_1.isAfter)(eligibleDate, new Date())) {
                nextEligibleDate = (0, date_fns_1.format)(eligibleDate, "yyyy-MM-dd");
            }
        }
        // Generate donation chart data (last 6 months)
        const donationChartData = generateDonationChartData(donations);
        // Generate health chart data
        const healthChartData = generateHealthChartData(healthRecords);
        // Calculate impact data
        const impactData = [
            { name: "Lives Saved", value: user.donationCount * 3 }, // Assuming each donation saves 3 lives
            { name: "Potential", value: 3 }, // Potential lives that could be saved with next donation
        ];
        // Generate upcoming events
        const upcomingEvents = generateUpcomingEvents(bloodRequests);
        // Generate recent activity
        const recentActivity = generateRecentActivity(donations, achievements, bloodRequests);
        // Determine donor rank based on donation count
        const donorRank = getDonorRank(user.donationCount);
        // Compile dashboard data
        const dashboardData = {
            stats: {
                totalDonations: user.donationCount,
                livesSaved: user.donationCount * 3,
                nextEligibleDate,
                donorRank,
                lastDonationDate: user.lastDonationDate
                    ? (0, date_fns_1.format)(new Date(user.lastDonationDate), "yyyy-MM-dd")
                    : null,
            },
            donationChartData,
            healthChartData,
            impactData,
            upcomingEvents,
            recentActivity,
        };
        res.status(200).json(dashboardData);
    }
    catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
};
exports.getUserDashboard = getUserDashboard;
// Helper function to generate donation chart data
const generateDonationChartData = (donations) => {
    const currentDate = new Date();
    const chartData = [];
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
        const monthDate = (0, date_fns_1.subMonths)(currentDate, i);
        const monthStr = (0, date_fns_1.format)(monthDate, "MMM");
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        // Count donations in this month
        const monthDonations = donations.filter((donation) => {
            const donationDate = new Date(donation.createdAt);
            return donationDate >= monthStart && donationDate <= monthEnd;
        }).length;
        chartData.push({
            month: monthStr,
            donations: monthDonations,
        });
    }
    return chartData;
};
// Helper function to generate health chart data
const generateHealthChartData = (healthRecords) => {
    return healthRecords
        .map((record) => ({
        date: (0, date_fns_1.format)(new Date(record.date), "MMM dd"),
        hemoglobin: record.hemoglobin,
    }))
        .reverse(); // Oldest to newest
};
// Helper function to generate upcoming events
const generateUpcomingEvents = (bloodRequests) => {
    const currentDate = new Date();
    const upcomingRequests = bloodRequests
        .filter((request) => new Date(request.requiredDate) > currentDate)
        .slice(0, 2)
        .map((request) => ({
        id: request.id,
        title: `Blood Request: ${request.patientName}`,
        date: (0, date_fns_1.format)(new Date(request.requiredDate), "yyyy-MM-dd"),
        location: request.hospitalName,
        type: "donation",
    }));
    // If we don't have enough upcoming requests, add a health checkup
    if (upcomingRequests.length < 2) {
        upcomingRequests.push({
            id: "health-checkup",
            title: "Regular Health Checkup",
            date: (0, date_fns_1.format)((0, date_fns_1.addMonths)(currentDate, 1), "yyyy-MM-dd"),
            location: "Medical Center",
            type: "checkup",
        });
    }
    return upcomingRequests;
};
// Helper function to generate recent activity
const generateRecentActivity = (donations, achievements, bloodRequests) => {
    const activities = [];
    // Add recent donations
    donations.slice(0, 2).forEach((donation) => {
        activities.push({
            id: `donation-${donation.id}`,
            type: "donation",
            date: (0, date_fns_1.format)(new Date(donation.createdAt), "yyyy-MM-dd"),
            description: `You donated blood at ${donation.hospitalName}`,
        });
    });
    // Add recent achievements
    achievements
        .filter((achievement) => achievement.achieved)
        .slice(0, 2)
        .forEach((achievement) => {
        activities.push({
            id: `achievement-${achievement.id}`,
            type: "achievement",
            date: (0, date_fns_1.format)(new Date(achievement.achievedDate || achievement.updatedAt), "yyyy-MM-dd"),
            description: `You earned the ${achievement.name} badge`,
        });
    });
    // Add recent fulfilled requests
    bloodRequests
        .filter((request) => request.status === "completed")
        .slice(0, 2)
        .forEach((request) => {
        activities.push({
            id: `request-${request.id}`,
            type: "request",
            date: (0, date_fns_1.format)(new Date(request.updatedAt), "yyyy-MM-dd"),
            description: `Blood request for ${request.patientName} was fulfilled`,
        });
    });
    // Sort by date (newest first) and take top 3
    return activities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
};
// Helper function to determine donor rank
const getDonorRank = (donationCount) => {
    if (donationCount >= 100)
        return "Life Saver";
    if (donationCount >= 50)
        return "Diamond";
    if (donationCount >= 25)
        return "Platinum";
    if (donationCount >= 10)
        return "Gold";
    if (donationCount >= 5)
        return "Silver";
    if (donationCount >= 1)
        return "Regular";
    return "New Donor";
};
