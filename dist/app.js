"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./app/shared/logger"));
const user_route_1 = require("./app/modules/user/user.route");
const bloodRequest_route_1 = require("./app/modules/bloodRequest/bloodRequest.route");
const bloodDrive_route_1 = require("./app/modules/bloodDrive/bloodDrive.route");
const bloodDonor_route_1 = require("./app/modules/bloodDonor/bloodDonor.route");
const volunteer_route_1 = require("./app/modules/volunteer/volunteer.route");
const review_route_1 = require("./app/modules/review/review.route");
const notification_route_1 = __importDefault(require("./app/modules/notification/notification.route"));
const donationReminder_1 = require("./app/jobs/donationReminder");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = require("./app/middlewares/notFound");
const statistics_route_1 = require("./app/modules/statistics/statistics.route");
const blog_route_1 = require("./app/modules/blog/blog.route");
const achievement_route_1 = require("./app/modules/achievement/achievement.route");
const donation_route_1 = require("./app/modules/donation/donation.route");
const healthRecord_route_1 = require("./app/modules/healthRecord/healthRecord.route");
const app = (0, express_1.default)();
// 🌐 Allowed Domains
const allowedDomains = [
    "http://localhost:3000",
    "https://blood-need.vercel.app",
    "https://bloodneed.com",
    "https://www.bloodneed.com",
];
// ✅ CORS Configuration
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedDomains.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Required for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Explicitly define headers
}));
// ✅ Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// ✅ Preflight Request Handling
app.options("*", (0, cors_1.default)());
// 🔔 Application Routes
app.use("/api/v1/auth", user_route_1.UserRoutes);
app.use("/api/v1/donations", donation_route_1.DonationRoutes);
app.use("/api/v1/blood-requests", bloodRequest_route_1.BloodRequestRoutes);
app.use("/api/v1/blood-drives", bloodDrive_route_1.BloodDriveRoutes);
app.use("/api/v1/blood-donor", bloodDonor_route_1.BloodDonorRoutes);
app.use("/api/v1/volunteers", volunteer_route_1.VolunteerRoutes);
app.use("/api/v1/reviews", review_route_1.ReviewRoutes);
app.use("/api/v1/notifications", notification_route_1.default);
app.use("/api/v1/statistics", statistics_route_1.StatisticsRoutes);
app.use("/api/v1/blog", blog_route_1.BlogRoutes);
app.use("/api/v1/achievements", achievement_route_1.AchievementRoutes);
app.use("/api/v1/health-records", healthRecord_route_1.HealthRecordRoutes);
// 🩸 Health Check & Root Routes
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});
// 🛡️ Global Error Handler
app.use(globalErrorHandler_1.globalErrorHandler);
// 🚫 Catch-all for undefined routes
app.use(notFound_1.notFound);
// 🛡️ Handle Syntax Errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        logger_1.default.error("JSON Syntax Error:", err);
        return res.status(400).json({ error: "Invalid JSON" });
    }
    next(err);
});
// 🕒 Start donation reminder job
(0, donationReminder_1.scheduleDonationReminders)();
exports.default = app;
