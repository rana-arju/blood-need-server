"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementRoutes = void 0;
const express_1 = __importDefault(require("express"));
const achievement_controller_1 = require("./achievement.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get("/my-achievements", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), achievement_controller_1.AchievementController.getMyAchievements);
router.get("/:userId", (0, auth_1.default)("admin", "superadmin"), achievement_controller_1.AchievementController.getMyAchievements);
exports.AchievementRoutes = router;
