import express, { type Application } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/user/user.route";
import { DonationRoutes } from "./app/modules/donation/donation.route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { BloodRequestRoutes } from "./app/modules/bloodRequest/bloodRequest.route";
import { BloodDriveRoutes } from "./app/modules/bloodDrive/bloodDrive.route";
import { BloodDonorRoutes } from "./app/modules/bloodDonor/bloodDonor.route";
import { VolunteerRoutes } from "./app/modules/volunteer/volunteer.route";
import { ReviewRoutes } from "./app/modules/review/review.route";
import { scheduleDonationReminders } from "./app/jobs/donationReminder";
import webpush from "web-push";
import notificationRoutes from "./app/modules/notification/notification.route"
import config from "./app/config";
import logger from "./app/shared/logger";
const app: Application = express();
// Web Push setup
webpush.setVapidDetails(
  "mailto:ranaarju20@gmail.com",
  config.vapid.publicKey || "",
  config.vapid.privateKey || ""
);
// 🔹 Allowed Domains (Add your multiple domains here)
const allowedDomains = [
  "http://localhost:3000",
  "https://blood-need.vercel.app",
  "https://bloodneed.com",
  "https://www.bloodneed.com",
];

// 🔹 Dynamic CORS Configuration
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedDomains.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies (useful for authentication)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Application routes
app.use("/api/v1/auth", UserRoutes);
app.use("/api/v1/donations", DonationRoutes);
app.use("/api/v1/blood-requests", BloodRequestRoutes);
app.use("/api/v1/blood-drives", BloodDriveRoutes);
app.use("/api/v1/blood-donor", BloodDonorRoutes);
app.use("/api/v1/volunteers", VolunteerRoutes);
app.use("/api/v1/reviews", ReviewRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});
// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" })
})
// Global error handler
app.use(globalErrorHandler);

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" })
})

// Error handling for syntax errors in JSON
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    logger.error("JSON Syntax Error:", err)
    return res.status(400).json({ error: "Invalid JSON" })
  }
  next(err)
})

// Start donation reminder job
scheduleDonationReminders();
// Not found
app.use(notFound);

export default app;
