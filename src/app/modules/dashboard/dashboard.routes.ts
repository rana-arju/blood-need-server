import express from "express";
import { getUserDashboard } from "./dashboard.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// Get dashboard data for a user
router.get(
  "/:userId",
  auth("admin", "user", "superadmin", "volunteer"),
  getUserDashboard
);

export const dashboardRoutes = router;
