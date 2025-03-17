import express, { type Application } from "express";
import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import csrf from "csurf";

import { UserRoutes } from "./app/modules/user/user.route";
import { BloodRequestRoutes } from "./app/modules/bloodRequest/bloodRequest.route";
import { BloodDriveRoutes } from "./app/modules/bloodDrive/bloodDrive.route";
import { BloodDonorRoutes } from "./app/modules/bloodDonor/bloodDonor.route";
import { VolunteerRoutes } from "./app/modules/volunteer/volunteer.route";
import { ReviewRoutes } from "./app/modules/review/review.route";
import notificationRoutes from "./app/modules/notification/notification.route";
import { scheduleDonationReminders } from "./app/jobs/donationReminder";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

import { StatisticsRoutes } from "./app/modules/statistics/statistics.route";
import { BlogRoutes } from "./app/modules/blog/blog.route";
import { AchievementRoutes } from "./app/modules/achievement/achievement.route";
import { DonationRoutes } from "./app/modules/donation/donation.route";
import { HealthRecordRoutes } from "./app/modules/healthRecord/healthRecord.route";
import { dashboardRoutes } from "./app/modules/dashboard/dashboard.routes";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import {
  authLimiter,
  compressionOptions,
  limiter,
} from "./app/middlewares/securityMiddleware";
import compression from "compression";
import { securityLoggingMiddleware } from "./app/middlewares/securityLoggingMiddleware";
import { logger } from "./app/shared/logger";
import { dataLoaderMiddleware } from "./app/middlewares/dataLoaderMiddleware";
import { compressionMiddleware } from "./app/middlewares/compressionMiddleware";
import { securityHeadersMiddleware } from "./app/middlewares/securityHeadersMiddleware";
import { notFound } from "./app/middlewares/notFound";

const app: Application = express();

// Security Middlewares
app.use(helmet());

// 🌐 Allowed Domains
const allowedDomains: string[] = [
  "http://localhost:3000",
  "https://blood-need.vercel.app",
  "https://bloodneed.com",
  "https://www.bloodneed.com",
];

// ✅ Proper CORS Configuration with Type Safety
const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedDomains.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // ✅ Required for cookies/authentication
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 200, // ✅ Fixes Preflight CORS issue
};

// ✅ Apply CORS Middleware Before Routes
app.use(cors(corsOptions));

// ✅ Explicitly Handle `OPTIONS` Preflight Requests
app.options("*", cors(corsOptions), (req, res) => {
  res.sendStatus(200); // ✅ Must return HTTP 200 OK for CORS preflight
});

app.use(securityHeadersMiddleware); // Custom security headers

// Only use CSRF if it's properly configured
/*
try {
  const csrfProtection = csrf({ cookie: true });
  app.use(csrfProtection);
} catch (error) {
  logger.warn("CSRF protection not enabled:", {
    error: error instanceof Error ? error.message : String(error),
  });
}
*/
// ✅ Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(compression(compressionOptions)); // Compress responses
app.use(compressionMiddleware); // Custom compression for large responses

// Apply rate limiting to all requests
app.use(limiter);

// Security logging
app.use(securityLoggingMiddleware);

// DataLoader middleware
app.use(dataLoaderMiddleware);

// 🔔 Application Routes
// Apply specific rate limiting to auth routes
app.use("/api/v1/users/login", authLimiter);
app.use("/api/v1/users/register", authLimiter);
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
app.use("/api/v1/achievements", AchievementRoutes);
app.use("/api/v1/health-records", HealthRecordRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

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
      logger.error("JSON Syntax Error:", { error: err.message });
      return res.status(400).json({ error: "Invalid JSON" });
    }
    next(err);
  }
);

// 🕒 Start donation reminder job
scheduleDonationReminders();

export default app;
