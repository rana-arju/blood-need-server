import express from "express";
import { AchievementController } from "./achievement.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/my-achievements",
  auth("user", "admin", "superadmin", "volunteer"),
  AchievementController.getMyAchievements
);

router.get(
  "/:userId",
  auth("admin", "superadmin"),
  AchievementController.getMyAchievements
);

export const AchievementRoutes = router;
