"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("./notification.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../shared/pick"));
const pagination_1 = require("../../constants/pagination");
const getUserNotifications = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const page = Number(paginationOptions.page || 1);
    const limit = Number(paginationOptions.limit || 10);
    const result = await notification_service_1.NotificationService.getUserNotifications(userId, page, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Notifications retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const markNotificationAsRead = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await notification_service_1.NotificationService.markNotificationAsRead(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Notification marked as read",
        data: result,
    });
});
const markAllNotificationsAsRead = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await notification_service_1.NotificationService.markAllNotificationsAsRead(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All notifications marked as read",
        data: result,
    });
});
const deleteNotification = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await notification_service_1.NotificationService.deleteNotification(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Notification deleted successfully",
        data: result,
    });
});
exports.NotificationController = {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
};
