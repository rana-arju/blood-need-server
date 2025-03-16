"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("./dashboard.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Get dashboard data for a user
router.get("/:userId", (0, auth_1.default)("admin", "user", "superadmin", "volunteer"), dashboard_controller_1.getUserDashboard);
exports.dashboardRoutes = router;
