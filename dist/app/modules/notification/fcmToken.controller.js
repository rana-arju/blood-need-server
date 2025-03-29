"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FCMTokenController = void 0;
const fcmToken_service_1 = require("./fcmToken.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const registerToken = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { token, device } = req.body;
    if (!token) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "FCM token is required",
        });
    }
    const result = await fcmToken_service_1.FCMTokenService.registerToken(userId, token, device);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "FCM token registered successfully",
        data: result,
    });
});
const removeToken = (0, catchAsync_1.default)(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "FCM token is required",
        });
    }
    const result = await fcmToken_service_1.FCMTokenService.removeToken(token);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "FCM token removed successfully",
        data: result,
    });
});
exports.FCMTokenController = {
    registerToken,
    removeToken,
};
