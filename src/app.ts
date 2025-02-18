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

const app: Application = express();

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
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Application routes
app.use("/api/v1/auth", UserRoutes);
app.use("/api/v1/donations", DonationRoutes);
app.use("/api/v1/blood-requests", BloodRequestRoutes);
app.use("/api/v1/blood-drives", BloodDriveRoutes);
app.use("/api/v1/blood-donors", BloodDonorRoutes);
app.use("/api/v1/volunteers", VolunteerRoutes);
app.use("/api/v1/reviews", ReviewRoutes);

// Health route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Global error handler
app.use(globalErrorHandler);
// Start donation reminder job
scheduleDonationReminders();
// Not found
app.use(notFound);

export default app;
