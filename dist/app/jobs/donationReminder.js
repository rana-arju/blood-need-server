"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleDonationReminders = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const email_1 = require("../utils/email");
const prisma = new client_1.PrismaClient();
const scheduleDonationReminders = () => {
    node_cron_1.default.schedule("0 10 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const eligibleDonors = yield prisma.bloodDonor.findMany({
            where: {
                lastDonationDate: {
                    lte: threeMonthsAgo,
                },
            },
            include: {
                user: true,
            },
        });
        for (const donor of eligibleDonors) {
            yield (0, email_1.sendEmail)(donor.user.email, "Blood Donation Reminder", `Dear ${donor.user.name},\n\nIt's been 3 months since your last blood donation. You are now eligible to donate again. Please consider donating blood to save lives.\n\nThank you for your generosity!`);
        }
    }));
};
exports.scheduleDonationReminders = scheduleDonationReminders;
