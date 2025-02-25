"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleDonationReminders = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const email_1 = require("../utils/email");
const prisma_1 = __importDefault(require("../shared/prisma"));
const scheduleDonationReminders = () => {
    node_cron_1.default.schedule("0 10 * * *", async () => {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        // ✅ Find users who are eligible to donate again
        const eligibleUsers = await prisma_1.default.user.findMany({
            where: {
                lastDonationDate: {
                    lte: threeMonthsAgo, // Last donation was at least 3 months ago
                },
            },
            select: {
                name: true,
                email: true,
            },
        });
        // ✅ Send email reminders
        for (const user of eligibleUsers) {
            await (0, email_1.sendEmail)(user.email, "Blood Donation Reminder", `Dear ${user.name},\n\nIt's been 3 months since your last blood donation. You are now eligible to donate again. Please consider donating blood to save lives.\n\nThank you for your generosity!`);
        }
    });
};
exports.scheduleDonationReminders = scheduleDonationReminders;
