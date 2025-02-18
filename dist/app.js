"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = require("./app/modules/user/user.route");
const donation_route_1 = require("./app/modules/donation/donation.route");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = require("./app/middlewares/notFound");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const bloodRequest_route_1 = require("./app/modules/bloodRequest/bloodRequest.route");
const bloodDrive_route_1 = require("./app/modules/bloodDrive/bloodDrive.route");
const bloodDonor_route_1 = require("./app/modules/bloodDonor/bloodDonor.route");
const volunteer_route_1 = require("./app/modules/volunteer/volunteer.route");
const review_route_1 = require("./app/modules/review/review.route");
const donationReminder_1 = require("./app/jobs/donationReminder");
const app = (0, express_1.default)();
// 🔹 Allowed Domains (Add your multiple domains here)
const allowedDomains = [
    "http://localhost:3000",
    "https://blood-need.vercel.app",
    "https://bloodneed.com",
    "https://www.bloodneed.com",
];
// 🔹 Dynamic CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedDomains.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies (useful for authentication)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
// Application routes
app.use("/api/v1/auth", user_route_1.UserRoutes);
app.use("/api/v1/donations", donation_route_1.DonationRoutes);
app.use("/api/v1/blood-requests", bloodRequest_route_1.BloodRequestRoutes);
app.use("/api/v1/blood-drives", bloodDrive_route_1.BloodDriveRoutes);
app.use("/api/v1/blood-donors", bloodDonor_route_1.BloodDonorRoutes);
app.use("/api/v1/volunteers", volunteer_route_1.VolunteerRoutes);
app.use("/api/v1/reviews", review_route_1.ReviewRoutes);
// Health route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});
// Global error handler
app.use(globalErrorHandler_1.globalErrorHandler);
// Start donation reminder job
(0, donationReminder_1.scheduleDonationReminders)();
// Not found
app.use(notFound_1.notFound);
exports.default = app;
