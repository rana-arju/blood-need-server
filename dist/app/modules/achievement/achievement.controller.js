"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementController = void 0;
const achievement_service_1 = require("./achievement.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const getMyAchievements = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await achievement_service_1.AchievementService.getUserAchievements(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My achievements retrieved successfully",
        data: result,
    });
});
const initializeMyAchievements = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await achievement_service_1.AchievementService.initializeUserAchievements(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Achievements initialized successfully",
        data: result,
    });
});
exports.AchievementController = {
    getMyAchievements,
    initializeMyAchievements,
};
