import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../utils/email";

const prisma = new PrismaClient();

export const scheduleDonationReminders = () => {
  cron.schedule("0 10 * * *", async () => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const eligibleDonors = await prisma.bloodDonor.findMany({
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
      await sendEmail(
        donor.user.email,
        "Blood Donation Reminder",
        `Dear ${donor.user.name},\n\nIt's been 3 months since your last blood donation. You are now eligible to donate again. Please consider donating blood to save lives.\n\nThank you for your generosity!`
      );
    }
  });
};
