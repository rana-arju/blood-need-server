"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_route_1 = require("./app/modules/user/user.route");
const bloodRequest_route_1 = require("./app/modules/bloodRequest/bloodRequest.route");
const bloodDrive_route_1 = require("./app/modules/bloodDrive/bloodDrive.route");
const bloodDonor_route_1 = require("./app/modules/bloodDonor/bloodDonor.route");
const volunteer_route_1 = require("./app/modules/volunteer/volunteer.route");
const review_route_1 = require("./app/modules/review/review.route");
const donationReminder_1 = require("./app/jobs/donationReminder");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const statistics_route_1 = require("./app/modules/statistics/statistics.route");
const blog_route_1 = require("./app/modules/blog/blog.route");
const achievement_route_1 = require("./app/modules/achievement/achievement.route");
const donation_route_1 = require("./app/modules/donation/donation.route");
const healthRecord_route_1 = require("./app/modules/healthRecord/healthRecord.route");
const dashboard_routes_1 = require("./app/modules/dashboard/dashboard.routes");
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const securityMiddleware_1 = require("./app/middlewares/securityMiddleware");
const compression_1 = __importDefault(require("compression"));
const securityLoggingMiddleware_1 = require("./app/middlewares/securityLoggingMiddleware");
const logger_1 = require("./app/shared/logger");
const dataLoaderMiddleware_1 = require("./app/middlewares/dataLoaderMiddleware");
const compressionMiddleware_1 = require("./app/middlewares/compressionMiddleware");
const securityHeadersMiddleware_1 = require("./app/middlewares/securityHeadersMiddleware");
const notFound_1 = require("./app/middlewares/notFound");
const notification_route_1 = require("./app/modules/notification/notification.route");
const app = (0, express_1.default)();
// Check if we're running on Vercel
const isVercel = process.env.VERCEL_REGION || process.env.VERCEL_URL;
// Security Middlewares
app.use((0, helmet_1.default)());
// 🌐 Allowed Domains
const allowedDomains = [
    "http://localhost:3000",
    "https://blood-need.vercel.app",
    "https://bloodneed.com",
    "https://www.bloodneed.com",
];
// ✅ Proper CORS Configuration with Type Safety
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc)
        if (!origin || allowedDomains.includes(origin)) {
            callback(null, true);
        }
        else {
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
app.use((0, cors_1.default)(corsOptions));
// ✅ Explicitly Handle `OPTIONS` Preflight Requests
app.options("*", (0, cors_1.default)(corsOptions), (req, res) => {
    res.sendStatus(200); // ✅ Must return HTTP 200 OK for CORS preflight
});
app.use(securityHeadersMiddleware_1.securityHeadersMiddleware); // Custom security headers
// Only use CSRF if not on Vercel (it requires cookies which can be tricky in serverless)
/*
if (!isVercel) {
  try {
    const csrf = require("csurf");
    const csrfProtection = csrf({ cookie: true });
    app.use(csrfProtection);
    logger.info("CSRF protection enabled");
  } catch (error) {
    logger.warn("CSRF protection not enabled:", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
  */
// ✅ Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, hpp_1.default)()); // Prevent HTTP Parameter Pollution
app.use((0, compression_1.default)(securityMiddleware_1.compressionOptions)); // Compress responses
app.use(compressionMiddleware_1.compressionMiddleware); // Custom compression for large responses
// Apply rate limiting to all requests
app.use(securityMiddleware_1.limiter);
// Security logging
app.use(securityLoggingMiddleware_1.securityLoggingMiddleware);
// DataLoader middleware
app.use(dataLoaderMiddleware_1.dataLoaderMiddleware);
// 🔔 Application Routes
// Apply specific rate limiting to auth routes
app.use("/api/v1/users/login", securityMiddleware_1.authLimiter);
app.use("/api/v1/users/register", securityMiddleware_1.authLimiter);
app.use("/api/v1/auth", user_route_1.UserRoutes);
app.use("/api/v1/donations", donation_route_1.DonationRoutes);
app.use("/api/v1/blood-requests", bloodRequest_route_1.BloodRequestRoutes);
app.use("/api/v1/blood-drives", bloodDrive_route_1.BloodDriveRoutes);
app.use("/api/v1/blood-donor", bloodDonor_route_1.BloodDonorRoutes);
app.use("/api/v1/volunteers", volunteer_route_1.VolunteerRoutes);
app.use("/api/v1/reviews", review_route_1.ReviewRoutes);
app.use("/api/v1/notifications", notification_route_1.NotificationRoutes);
app.use("/api/v1/statistics", statistics_route_1.StatisticsRoutes);
app.use("/api/v1/blog", blog_route_1.BlogRoutes);
app.use("/api/v1/achievements", achievement_route_1.AchievementRoutes);
app.use("/api/v1/health-records", healthRecord_route_1.HealthRecordRoutes);
app.use("/api/v1/dashboard", dashboard_routes_1.dashboardRoutes);
// 🩸 Health Check & Root Routes
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running", website: "Blood Need", Creator: "Mohammad Rana Arju", copyRights: true });
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
        logger_1.logger.error("JSON Syntax Error:", { error: err.message });
        return res.status(400).json({ error: "Invalid JSON" });
    }
    next(err);
});
// 🕒 Start donation reminder job only if not on Vercel
if (!isVercel) {
    try {
        (0, donationReminder_1.scheduleDonationReminders)();
        logger_1.logger.info("Donation reminder job scheduled");
    }
    catch (error) {
        logger_1.logger.error("Failed to schedule donation reminders:", {
            error: error instanceof Error ? error.message : String(error),
        });
    }
}
exports.default = app;
