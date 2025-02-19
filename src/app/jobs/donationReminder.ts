import cron from "node-cron";
import { sendEmail } from "../utils/email";
import { PrismaClient } from "@prisma/client";
import prisma from "../shared/prisma";
export const scheduleDonationReminders = () => {
  cron.schedule("0 10 * * *", async () => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // ✅ Find users who are eligible to donate again
    const eligibleUsers = await prisma.user.findMany({
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
      await sendEmail(
        user.email,
        "Blood Donation Reminder",
        `Dear ${user.name},\n\nIt's been 3 months since your last blood donation. You are now eligible to donate again. Please consider donating blood to save lives.\n\nThank you for your generosity!`
      );
    }
  });
};
