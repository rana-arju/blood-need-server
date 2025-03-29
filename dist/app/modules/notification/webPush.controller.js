"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebPushController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const config_1 = __importDefault(require("../../config"));
const webpush_service_1 = require("./webpush.service");
const AppError_1 = __importDefault(require("../../error/AppError"));
const getVapidPublicKey = (0, catchAsync_1.default)(async (req, res) => {
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "VAPID public key retrieved successfully",
        data: { publicKey: config_1.default.vapid.publicKey },
    });
});
const subscribe = (0, catchAsync_1.default)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.default(400, "User ID is required");
    }
    const userId = req.user.id;
    const subscription = req.body;
    try {
        const result = await webpush_service_1.WebPushService.saveSubscription(userId, subscription);
        console.log("Asdfasdf", result);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Web push subscription saved successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Error saving subscription:", error); // Log the error
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Failed to save web push subscription",
            data: null,
        });
    }
}); // Save web push subscription
const unsubscribe = (0, catchAsync_1.default)(async (req, res) => {
    const { endpoint } = req.body;
    if (!endpoint) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Endpoint is required",
        });
    }
    const result = await webpush_service_1.WebPushService.deleteSubscription(endpoint);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Web push subscription removed successfully",
        data: result,
    });
});
exports.WebPushController = {
    getVapidPublicKey,
    subscribe,
    unsubscribe,
};
