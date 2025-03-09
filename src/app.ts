import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import logger from "./app/shared/logger";

import { UserRoutes } from "./app/modules/user/user.route";
import { DonationRoutes } from "./app/modules/donation/donation.route";
import { BloodRequestRoutes } from "./app/modules/bloodRequest/bloodRequest.route";
import { BloodDriveRoutes } from "./app/modules/bloodDrive/bloodDrive.route";
import { BloodDonorRoutes } from "./app/modules/bloodDonor/bloodDonor.route";
import { VolunteerRoutes } from "./app/modules/volunteer/volunteer.route";
import { ReviewRoutes } from "./app/modules/review/review.route";
import notificationRoutes from "./app/modules/notification/notification.route";
import { scheduleDonationReminders } from "./app/jobs/donationReminder";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import config from "./app/config";
import { StatisticsRoutes } from "./app/modules/statistics/statistics.route";
import { BlogRoutes } from "./app/modules/blog/blog.route";

const app: Application = express();

// 🌐 Allowed Domains
const allowedDomains = [
  "http://localhost:3000",
  "https://blood-need.vercel.app",
  "https://bloodneed.com",
  "https://www.bloodneed.com",
];

// ✅ CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedDomains.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Required for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Explicitly define headers
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Preflight Request Handling
app.options("*", cors());

// 🔔 Application Routes
app.use("/api/v1/auth", UserRoutes);
app.use("/api/v1/donations", DonationRoutes);
app.use("/api/v1/blood-requests", BloodRequestRoutes);
app.use("/api/v1/blood-drives", BloodDriveRoutes);
app.use("/api/v1/blood-donor", BloodDonorRoutes);
app.use("/api/v1/volunteers", VolunteerRoutes);
app.use("/api/v1/reviews", ReviewRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/statistics", StatisticsRoutes);
app.use("/api/v1/blog", BlogRoutes);
// 🩸 Health Check & Root Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// 🛡️ Global Error Handler
app.use(globalErrorHandler);

// 🚫 Catch-all for undefined routes
app.use(notFound);

// 🛡️ Handle Syntax Errors
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof SyntaxError && "body" in err) {
      logger.error("JSON Syntax Error:", err);
      return res.status(400).json({ error: "Invalid JSON" });
    }
    next(err);
  }
);

// 🕒 Start donation reminder job
scheduleDonationReminders();

export default app;
